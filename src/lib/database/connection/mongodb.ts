import { Document, MongoClient, Filter, UpdateFilter } from 'mongodb';
import { DeletionError, InsertionError, SelectionError, UpdateError } from './errors';
import { FilterFormat, UpdateFilterFormat } from './types';
import { checkEnvVars } from '@/lib/errors/environmentErrors';

checkEnvVars(["MONGO_USER", "MONGO_PASSWORD", "MONGO_HOST", "MONGO_PORT"], "Mongo DB environment variable missing");

const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/`;

const databaseName = `${process.env.MONGO_DATABASE}`;

function FormatFilter(filter: FilterFormat): Filter<Document> {
  let obj: Filter<Document> = {};
  for (let filterParam of filter) {
    obj[filterParam.param] = filterParam.value;
  }
  return obj;
}

function FormatUpdateFilter(filter: UpdateFilterFormat): UpdateFilter<Document> {
  let obj: UpdateFilter<Document> = {};
  obj.$set = {};
  for (let filterParam of filter) {
    obj.$set[filterParam.param] = filterParam.value;
  }
  return obj;
}

async function Select(tableName: string, filter: FilterFormat) {
  const client = new MongoClient(uri);
  try {
    const database = client.db(databaseName);
    const table = database.collection(tableName);
    const cursor = table.find(FormatFilter(filter));
    const data = await cursor.toArray();
    return data;
  } catch(e) {
    throw new SelectionError(`DB error while handling SELECT request to ${tableName}`, e);
  } finally {
    client.close();
  }
}

async function Insert(tableName: string, array: Object[]) {
  const client = new MongoClient(uri);
  try {
    const database = client.db(databaseName);
    const table = database.collection(tableName);
    const res = await table.insertMany(array);
    return res.insertedCount;
  } catch(e) {
    throw new InsertionError(`DB error while handling INSERT request to ${tableName}`, e);
  } finally {
    client.close();
  }
}

async function Delete(tableName: string, filter: FilterFormat) {
  const client = new MongoClient(uri);
  try {
    const database = client.db(databaseName);
    const table = database.collection(tableName);
    const res = await table.deleteMany(FormatFilter(filter));
    return res.deletedCount;
  } catch(e) {
    throw new DeletionError(`DB error while handling DELETE request to ${tableName}`, e);
  } finally {
    client.close();
  }
}

async function Update(tableName: string, filter: FilterFormat, query: UpdateFilterFormat) {
  const client = new MongoClient(uri);
  try {
    const database = client.db(databaseName);
    const table = database.collection(tableName);
    const res = await table.updateMany(FormatFilter(filter), FormatUpdateFilter(query));
    console.log(FormatUpdateFilter(query))
    return res.modifiedCount;
  } catch(e) {
    throw new UpdateError(`DB error while handling UPDATE request to ${tableName}`, e);
  } finally {
    client.close();
  }
}

export default {
  Select,
  Insert,
  Delete,
  Update
}