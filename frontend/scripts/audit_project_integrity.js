import fs from 'fs'
import path from 'path'

function getAllFiles(dir, exts = ['.vue', '.js', '.cjs', '.mjs', '.json']) {
  let results = []
  const list = fs.readdirSync(dir)
  for (const file of list) {
    const full = path.join(dir, file)
    const stat = fs.statSync(full)
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        results = results.concat(getAllFiles(full, exts))
      }
    } else {
      if (exts.some(ext => file.endsWith(ext))) {
        results.push(full)
      }
    }
  }
  return results
}

const allVueFiles = getAllFiles('src', ['.vue'])
const allSourceAndTestFiles = [
  ...getAllFiles('src', ['.vue', '.js']),
  ...getAllFiles('tests', ['.js', '.cjs']),
  ...getAllFiles('scripts', ['.js', '.cjs', '.mjs'])
]

console.log('=== 1. VUE COMPONENT USAGE AUDIT ===')
console.log('Total Vue components in src:', allVueFiles.length)

const unreferencedVue = []
for (const vuePath of allVueFiles) {
  const base = path.basename(vuePath)
  const nameWithoutExt = base.replace('.vue', '')
  
  let refCount = 0
  for (const codeFile of allSourceAndTestFiles) {
    if (codeFile === vuePath) continue
    const content = fs.readFileSync(codeFile, 'utf8')
    if (
      content.includes(base) ||
      content.includes(`/${nameWithoutExt}`) ||
      content.includes(`'${nameWithoutExt}'`) ||
      content.includes(`"${nameWithoutExt}"`)
    ) {
      refCount++
    }
  }
  
  if (refCount === 0) {
    unreferencedVue.push(vuePath)
  }
}

console.log('Unreferenced Vue components:', unreferencedVue.length === 0 ? 'None (All 100% referenced)' : unreferencedVue)

console.log('\n=== 2. ROUTER DEFINED VIEWS AUDIT ===')
const routerContent = fs.readFileSync('src/router/index.js', 'utf8')
const registeredImports = routerContent.match(/import\s*\(\s*['"]@\/views\/[^'"]+['"]\s*\)/g) || []
console.log(`Found ${registeredImports.length} dynamic route view imports in router/index.js`)

console.log('\n=== 3. DEPENDENCIES AUDIT ===')
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const allCodeFiles = getAllFiles('src', ['.vue', '.js'])
const depUsage = {}

for (const dep of Object.keys(pkg.dependencies || {})) {
  depUsage[dep] = 0
  for (const f of allCodeFiles) {
    const c = fs.readFileSync(f, 'utf8')
    if (c.includes(`'${dep}'`) || c.includes(`"${dep}"`) || c.includes(`'${dep}/`) || c.includes(`"${dep}/`)) {
      depUsage[dep]++
    }
  }
}

for (const dep of Object.keys(pkg.devDependencies || {})) {
  depUsage[dep] = 0
  const buildConfigFiles = ['vite.config.js', 'vitest.config.js', 'package.json', ...getAllFiles('scripts', ['.cjs', '.js'])]
  for (const f of buildConfigFiles) {
    if (!fs.existsSync(f)) continue
    const c = fs.readFileSync(f, 'utf8')
    if (c.includes(`'${dep}'`) || c.includes(`"${dep}"`) || c.includes(`'${dep}/`) || c.includes(`"${dep}/`)) {
      depUsage[dep]++
    }
  }
}
console.log('Dependency usage scan results:', depUsage)

console.log('\n=== 4. SCRATCH & OBSOLETE IMPLEMENTATIONS AUDIT ===')
if (fs.existsSync('scratch')) {
  const scratchFiles = fs.readdirSync('scratch')
  console.log(`Scratch directory contains ${scratchFiles.length} files:`, scratchFiles)
}

console.log('\n=== 5. BACKEND-READY FILES AUDIT ===')
const storeFiles = getAllFiles('src', ['.js']).filter(f => f.includes('store') || f.includes('service') || f.includes('api'))
console.log('Store and service integration points:')
storeFiles.forEach(f => console.log('  -', f))
