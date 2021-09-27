import { Arguments } from "./Types";

export interface FindEventArguments extends Arguments {
    organizationId?: number
}

export interface CreateEventArguments {
    name: string,
    description: string,
    dateAndTime: Date,
    organizationId: number
}

export interface UpdateEventArguments {
    id: number,
    name?: string,
    description?: string,
    dateAndTime?: Date,
}

export interface DeleteEventArguments {
    id?: number,
    organizationId?: number
}