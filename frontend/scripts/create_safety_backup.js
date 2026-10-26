import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const projectRoot = path.resolve('C:/xampp/htdocs/ECodrive')
const backupsParent = path.resolve('C:/xampp/htdocs/ECodrive_Backups')

const now = new Date()
const pad = (n) => String(n).padStart(2, '0')
const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
const backupDir = path.join(backupsParent, `ECodrive_backup_${timestamp}`)

console.log(`Starting backup of ${projectRoot}...`)
console.log(`Target: ${backupDir}`)

if (!fs.existsSync(backupsParent)) {
  fs.mkdirSync(backupsParent, { recursive: true })
}
fs.mkdirSync(backupDir, { recursive: true })

// Use robocopy on Windows to copy all files, excluding node_modules and dist
try {
  // robocopy exit codes <= 7 indicate successful copying
  execSync(`robocopy "${projectRoot}" "${backupDir}" /E /XD "node_modules" "dist" /NFL /NDL /NJH /NJS`, { stdio: 'pipe' })
} catch (err) {
  // robocopy returns non-zero on success (e.g., 1 = files copied)
  if (err.status > 7) {
    console.error('Robocopy failed:', err)
    process.exit(1)
  }
}

// Create git bundle for complete commit history & refs
const bundlePath = path.join(backupDir, 'git_repo_complete.bundle')
console.log(`Creating git bundle: ${bundlePath}`)
execSync(`git bundle create "${bundlePath}" --all`, { cwd: projectRoot, stdio: 'inherit' })

// Verify backup contents
const copiedEntries = fs.readdirSync(backupDir)
console.log(`\nBackup verified! Found ${copiedEntries.length} top-level entries in backup:`)
copiedEntries.forEach(entry => console.log(`  - ${entry}`))

const srcStats = fs.readdirSync(path.join(backupDir, 'src'))
console.log(`Verified 'src' contains ${srcStats.length} items.`)

const testStats = fs.readdirSync(path.join(backupDir, 'tests'))
console.log(`Verified 'tests' contains ${testStats.length} items.`)

console.log(`\nBackup successfully completed at: ${backupDir}`)
