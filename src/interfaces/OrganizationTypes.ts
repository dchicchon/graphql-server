import { Arguments } from "./Types";

export interface OrganizationType {
    id: number,
    name: string
}

export interface FindOrganizationArguments extends Arguments {

}

export interface CreateOrganizationArguments {
    name: string
}

export interface UpdateOrganizationArguments {
    id: number,
    name: string
}

export interface DeleteOrganizationArguments {
    id: number
}