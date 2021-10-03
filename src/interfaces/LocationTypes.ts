import { Arguments } from './Types';

export interface LocationType {
    id: number,
    name: string,
    address: string,
    latitude: number,
    longitude: number,
    organizationId: number
}
export interface FindLocationArguments extends Arguments {
    organizationId?: number
}

export interface CreateLocationArguments {
    name: string,
    address: string,
    organizationId: number
}

export interface UpdateLocationArguments {
    id: number,
    name?: string,
    address?: string,
    latitude?: number,
    longitude?: number
}


export interface DeleteLocationArguments {
    id?: number,
    organizationId?: number
}