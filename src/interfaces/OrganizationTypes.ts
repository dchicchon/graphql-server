import { EventType } from "./EventTypes";
import { LocationType } from "./LocationTypes";
import { Arguments } from "./Types";

export interface OrganizationType {
    id: number,
    name: string,
    locations: Array<LocationType>,
    events: Array<EventType>
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