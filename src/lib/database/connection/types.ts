export type FilterParam = {
    param: string,
    value: string | RegExp
}

export type FilterFormat = FilterParam[];

export type UpdateParam = {
    param: string,
    value: any
}

export type UpdateFilterFormat = UpdateParam[];