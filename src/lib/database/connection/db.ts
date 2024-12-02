import { FilterFormat, UpdateFilterFormat } from "./types";
import DB from "./postgresql";

export async function Select(tableName: string, filter: FilterFormat): Promise<any[]> {
    return await DB.Select(tableName, filter);   
}

export async function SelectOne(tableName: string, filter: FilterFormat): Promise<any | null> {
    const res = await DB.Select(tableName, filter);
    if (res.length === 0) {
        return null;
    } else {
        return res[0];
    }
}

export async function Insert(tableName: string, array: Object[]): Promise<number> {
    return await DB.Insert(tableName, array);
}

export async function InsertOne(tableName: string, obj: Object): Promise<boolean> {
    return (await DB.Insert(tableName, [obj])) !== 0;
}

export async function Delete(tableName: string, filter: FilterFormat): Promise<number> {
    return await DB.Delete(tableName, filter);
}

export async function Update(tableName: string, filter: FilterFormat, query: UpdateFilterFormat): Promise<number> {
    return await DB.Update(tableName, filter, query);
}