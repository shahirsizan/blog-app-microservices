import { neon } from "@neondatabase/serverless";
import "dotenv/config";

export const sql = neon(process.env.DB_URL as string);
