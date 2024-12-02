import { Pool } from "pg";
import { FilterFormat, UpdateFilterFormat } from "./types";
import { SelectionError } from "./errors";
import { checkEnvVars } from "@/lib/errors/environmentErrors";

checkEnvVars(["PGSQL_USER", "PGSQL_PASSWORD", "PGSQL_HOST", "PGSQL_PORT", "PGSQL_DATABASE"],
  "PostgreSQL DB environment variable missing");

let conn = new Pool({
  user: process.env.PGSQL_USER,
  password: process.env.PGSQL_PASSWORD,
  host: process.env.PGSQL_HOST,
  port: parseInt(process.env.PGSQL_PORT!),
  database: process.env.PGSQL_DATABASE,
});

function ToPostgreSQLValue(val: any) {
  return JSON.stringify(val).replaceAll("\"", "\'");
}

function ConstructCondition(filter: FilterFormat): string {
  return `WHERE ${filter.map((param) => {
    return `${param.param} = ${ToPostgreSQLValue(param.value)}\n   &&`
  }).join("").slice(0, -6) }`
}

function ConstructSelect(tableName: string, filter: FilterFormat): string {
  return `SELECT *
  FROM ${tableName}
  ${ConstructCondition(filter)}`;
}

function ConstructUpdate(tableName: string, filter: FilterFormat, updateFilter: UpdateFilterFormat): string {
  return `UPDATE ${tableName}
  SET ${updateFilter.map((param) => {
    return `${param.param} = ${ToPostgreSQLValue(param.value)},\n  `
  }).join("").slice(0, -4) }
  ${ConstructCondition(filter)}`;
}

function ConstructInsert(tableName: string, array: Object[]) {
  return `INSERT INTO ${tableName} (${Object.keys(array[0]).join(", ")})
    VALUES
    ${array.map((obj) => {
      return `(${Object.values(obj).map((val) => ToPostgreSQLValue(val)).join(", ")})`
    }).join("\n ")}`
}

function ConstructDelete(tableName: string, filter: FilterFormat) {
  return `DELETE FROM ${tableName}
  ${ConstructCondition(filter)}`
}

async function sendQuery(query: string) {
  return await conn.query(query);
}

async function Select(tableName: string, filter: FilterFormat) {
  let query = ConstructSelect(tableName, filter);
  try {   
    let res = await sendQuery(query);
    return res.rows;
  } catch (e) {
    throw new SelectionError(`DB error while handling SELECT request to ${tableName} with query:
${query}`, e);
  }
}

async function Insert(tableName: string, array: Object[]) {
  let query = ConstructInsert(tableName, array);
  try {
    let res = await sendQuery(query);
    return res.rowCount ?? 0;
  } catch (e) {
    throw new SelectionError(`DB error while handling INSERT request to ${tableName} with query:
${query}`, e);
  }
}

async function Delete(tableName: string, filter: FilterFormat) {
  let query = ConstructDelete(tableName, filter);
  try {
    let res = await sendQuery(query);
    return res.rowCount ?? 0;
  } catch (e) {
    throw new SelectionError(`DB error while handling DELETE request to ${tableName} with query:
${query}`, e);
  }
}

async function Update(tableName: string, filter: FilterFormat, updateFilter: UpdateFilterFormat) {
  let query = ConstructUpdate(tableName, filter, updateFilter);
  try {
    let res = await sendQuery(query);
    return res.rowCount ?? 0;
  } catch (e) {
    throw new SelectionError(`DB error while handling UPDATE request to ${tableName} with query:
${query}`, e);
  }
}

export default {
  Select,
  Insert,
  Delete,
  Update
}