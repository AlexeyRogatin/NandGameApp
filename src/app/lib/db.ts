import { Pool } from "pg";

let conn = new Pool({
    user: process.env.PGSQL_USER,
    password: process.env.PGSQL_PASSWORD,
    host: process.env.PGSQL_HOST,
    port: Number.parseInt(process.env.PGSQL_PORT!),
    database: process.env.PGSQL_DATABASE,
  });


export default conn ;