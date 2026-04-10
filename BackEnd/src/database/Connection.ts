import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("DB Connected to InterviewSpark!");
  } catch (err) {
    console.error("DB Error:", err);
  }
})();

export const query = (text: string, params: unknown[] = []) => {
  return pool.query(text, params);
};

export default pool;