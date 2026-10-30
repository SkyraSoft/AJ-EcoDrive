import { connectDB, disconnectDB, query } from '../src/config/db.js'

async function main() {
  await connectDB()
  const users = await query('SELECT id, name, username, email, role_id, status FROM users')
  console.log(JSON.stringify(users, null, 2))
  await disconnectDB()
}

main().catch(console.error)
