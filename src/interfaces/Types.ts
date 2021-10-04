import API from '../datasources/api'

export interface Arguments {
    id?: number,
    ids?: Array<number>,
    name?: string,
}

export interface Context {
    dataSources: DataSources
}

export interface Error {
    response: any | unknown
}

export interface Store {
    organization: any,
    event: any,
    location: any
}

export interface DataSources {
    api: API
}