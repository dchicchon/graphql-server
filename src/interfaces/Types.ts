import { Model, ModelCtor } from 'sequelize/types';
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
    response: string | unknown
}

export interface Store {
    organization: ModelCtor<Model>,
    event: ModelCtor<Model>,
    location: ModelCtor<Model>
}

export interface DataSources {
    api: API
}