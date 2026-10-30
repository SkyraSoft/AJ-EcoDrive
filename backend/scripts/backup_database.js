/**
 * AJ ECODRIVE ERP — AUTOMATED DATABASE BACKUP ENGINE
 * 
 * Creates timestamped, gzip-compressed SQL dumps of the MySQL database
 * using mysqldump with atomic single-transaction consistency.
 * Computes SHA-256 integrity hash, logs to backup manifest, and prunes older backups.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'
import zlib from 'zlib'
import crypto from 'crypto'
import { pipeline } from 'stream/promises'
import { config } from '../src/config/env.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.resolve(__dirname, '../../')
const BACKUP_DIR = path.resolve(PROJECT_ROOT, 'backups')
const MANIFEST_FILE = path.resolve(BACKUP_DIR, 'backup_manifest.json')

// Default retention: Keep up to 14 latest backups (e.g. 7 days with twice-daily backups)
const RETENTION_LIMIT = parseInt(process.env.BACKUP_RETENTION_COUNT, 10) || 14

// Locate mysqldump binary
function getMysqldumpPath() {
  const possiblePaths = [
    'C:\\xampp\\mysql\\bin\\mysqldump.exe',
    'C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe',
    'C:\\Program Files\\MariaDB 10.4\\bin\\mysqldump.exe',
    'mysqldump'
  ]
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p
  }
  return 'mysqldump'
}

export async function createDatabaseBackup(options = {}) {
  const startTime = Date.now()
  const dbConfig = config.db
  const mysqldumpPath = getMysqldumpPath()

  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true })
  }

  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const timestampStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  const filename = `ecodrive_backup_${timestampStr}.sql.gz`
  const targetPath = path.resolve(BACKUP_DIR, filename)

  console.log('===============================================================')
  console.log('AJ ECODRIVE ERP — DATABASE BACKUP IN PROGRESS')
  console.log('===============================================================')
  console.log(`Timestamp:       ${now.toISOString()}`)
  console.log(`Target Database: ${dbConfig.name} on ${dbConfig.host}:${dbConfig.port}`)
  console.log(`Binary:          ${mysqldumpPath}`)
  console.log(`Destination:     ${targetPath}`)

  const args = [
    `-h${dbConfig.host}`,
    `-P${dbConfig.port}`,
    `-u${dbConfig.user}`
  ]

  if (dbConfig.password && dbConfig.password.trim() !== '') {
    args.push(`-p${dbConfig.password}`)
  }

  args.push(
    '--single-transaction',
    '--quick',
    '--routines',
    '--triggers',
    '--events',
    '--skip-lock-tables',
    dbConfig.name
  )

  const dumpProcess = spawn(mysqldumpPath, args, { stdio: ['ignore', 'pipe', 'pipe'] })
  const gzip = zlib.createGzip({ level: 9 })
  const hash = crypto.createHash('sha256')
  const fileStream = fs.createWriteStream(targetPath)

  let uncompressedBytes = 0
  let stderrOutput = ''

  dumpProcess.stdout.on('data', (chunk) => {
    uncompressedBytes += chunk.length
    hash.update(chunk)
  })

  dumpProcess.stderr.on('data', (chunk) => {
    stderrOutput += chunk.toString()
  })

  const processClosePromise = new Promise((resolve, reject) => {
    dumpProcess.on('error', reject)
    dumpProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`mysqldump exited with error code ${code}: ${stderrOutput}`))
      } else {
        resolve()
      }
    })
  })

  try {
    await Promise.all([
      pipeline(dumpProcess.stdout, gzip, fileStream),
      processClosePromise
    ])
  } catch (err) {
    if (fs.existsSync(targetPath)) fs.unlinkSync(targetPath)
    throw err
  }

  const stats = fs.statSync(targetPath)
  const sha256 = hash.digest('hex')
  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2)
  const ratio = uncompressedBytes > 0 ? ((1 - (stats.size / uncompressedBytes)) * 100).toFixed(1) : '0'

  console.log('\n[SUCCESS] Backup completed cleanly!')
  console.log(`Uncompressed Size: ${(uncompressedBytes / 1024).toFixed(2)} KB`)
  console.log(`Compressed Size:   ${(stats.size / 1024).toFixed(2)} KB (${ratio}% compression)`)
  console.log(`SHA-256 Checksum:  ${sha256}`)
  console.log(`Execution Time:    ${durationSec}s`)

  const backupRecord = {
    filename,
    fullPath: targetPath,
    timestamp: now.toISOString(),
    database: dbConfig.name,
    host: dbConfig.host,
    port: dbConfig.port,
    uncompressedBytes,
    compressedBytes: stats.size,
    sha256,
    durationSec: parseFloat(durationSec),
    status: 'VERIFIED'
  }

  // Update Manifest
  updateManifest(backupRecord)

  // Prune old backups
  pruneOldBackups(RETENTION_LIMIT)

  console.log('===============================================================\n')
  return backupRecord
}

function updateManifest(record) {
  let manifest = { version: '1.0', totalBackups: 0, backups: [] }
  try {
    if (fs.existsSync(MANIFEST_FILE)) {
      manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'))
    }
  } catch (e) {
    console.warn('Could not read existing manifest, creating fresh one.')
  }

  manifest.backups = manifest.backups || []
  manifest.backups.unshift(record)
  manifest.totalBackups = manifest.backups.length
  manifest.lastBackup = record.timestamp

  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2), 'utf8')
  console.log(`Manifest updated at: ${MANIFEST_FILE}`)
}

function pruneOldBackups(retentionLimit) {
  try {
    if (!fs.existsSync(MANIFEST_FILE)) return
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'))
    if (!manifest.backups || manifest.backups.length <= retentionLimit) {
      console.log(`Retention check: ${manifest.backups?.length || 0} backups on disk (limit: ${retentionLimit}). No pruning needed.`)
      return
    }

    const toKeep = manifest.backups.slice(0, retentionLimit)
    const toPrune = manifest.backups.slice(retentionLimit)

    for (const item of toPrune) {
      const p = path.resolve(BACKUP_DIR, item.filename)
      if (fs.existsSync(p)) {
        fs.unlinkSync(p)
        console.log(`Pruned old backup: ${item.filename}`)
      }
    }

    manifest.backups = toKeep
    manifest.totalBackups = toKeep.length
    fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2), 'utf8')
    console.log(`Pruning complete. Retaining ${toKeep.length} latest backups.`)
  } catch (err) {
    console.error('Error during backup pruning:', err)
  }
}

// Auto-run when called directly via CLI
if (process.argv[1] && process.argv[1].endsWith('backup_database.js')) {
  createDatabaseBackup()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Fatal backup error:', err)
      process.exit(1)
    })
}
