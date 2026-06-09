import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || "localhost",
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "root_password",
  database: process.env.DATABASE_NAME || "perpustakaan",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
