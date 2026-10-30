import { connectDB, disconnectDB, query } from '../src/config/db.js'

async function main() {
  await connectDB()
  const cols = await query('DESCRIBE users')
  console.log('Columns in users table:')
  console.table(cols)
  const indexes = await query('SHOW INDEX FROM users')
  console.log('Indexes on users table:')
  console.table(indexes.map(i => ({ Key_name: i.Key_name, Column_name: i.Column_name, Non_unique: i.Non_unique })))
  await disconnectDB()
}

main().catch(console.error)

