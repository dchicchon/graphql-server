import API from '../datasources/api'

export interface Arguments {
    id?: number,
    ids?: [number],
    name?: string,
    address?: string,
    description?: string,
    dateAndTime?: Date,
    organizationId?: number,
}

// DataSrouce is not correct right now.
export interface DataSourceParent {
    dataSources: any
}

export interface Error {
    response: any | unknown
}

export interface DatabaseObject {
    description?: String,
    latitude?: Number,
    name?: string,
    message?: string,
}

export interface Store {
    organization: any,
    event: any,
    location: any
}

export interface UpdateObject {
    name?: string,
    address?: string,
    latitude?: number,
    longitude?: number,
    dateAndTime?: Date,
    description?: String,
}

export interface DataSources {
    api: API
}

export interface Context {
    dataSources: DataSources
}

export interface Organization {
    id: number,
    name: string
}

export interface Location {
    id: number
}

export interface Event {
    id: number
}