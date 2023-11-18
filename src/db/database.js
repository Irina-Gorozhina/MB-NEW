import mysql from "mysql2/promise";

export const db_conn = mysql.createPool({
  host: "localhost",
  user: "mobile-bazaar",
  password: "mobile-bazaar",
  database: "mobile-bazaar",
});
