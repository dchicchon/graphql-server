export interface Arguments {
    id?: number,
    ids?: [number],
    name?: String,
    address?: String,
    description?: String,
    dateAndTime?: Date,
    organizationId?: number,
}

// DataSrouce is not correct right now.
export interface DataSource {
    dataSources: any
}
