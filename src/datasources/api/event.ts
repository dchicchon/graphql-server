
import { Arguments, CreateEventArguments, UpdateObject } from '../../interfaces/Types'

export default class Event {
    event
    constructor(event: any) {
        this.event = event
    }

    // =========================
    // CREATE
    // =========================

    async createEvent({ name, dateAndTime, description, organizationId }: CreateEventArguments) {
        // console.log("Creating Event")
        const [event, created] = await this.event.findOrCreate({
            where: { name, dateAndTime: dateAndTime, description, organizationId },
        });
        return event.dataValues
    }


    async getEvent({ id }: Arguments) {
        const event = await this.event.findOne({ where: { id } });
        return event;
    }


    async getEvents({ ids }: Arguments) {
        if (ids) {
            return Promise.all(ids.map((id) => this.getEvent({ id })));
        }
    }


    async getAllEvents() {
        const events = await this.event.findAll();
        return events

    }


    async getAllEventsByOrgId({ id }: Arguments) {
        const events = await this.event.findAll({
            where: {
                organizationId: id,
            },
        });
        return events;
    }
    // END CREATE

    // =========================
    // UPDATE
    // =========================
    async updateEvent({ id, name, dateAndTime, description }: Arguments) {
        // console.log('Update Event')
        const updateObject: UpdateObject = {}
        if (name) updateObject.name = name;
        if (dateAndTime) updateObject.dateAndTime = new Date(dateAndTime)
        if (description) updateObject.description = description
        const updateResults = await this.event.update(updateObject,
            {
                where: {
                    id
                }
            });
        // Maybe do a quick find event to return 
        const findResults = await this.getEvent({ id })
        return findResults
    }


    async deleteEvent({ id }: Arguments) {
        const event = await this.event.destroy({ where: { id } });
        return event;
    }

    async deleteEventByOrganizationId({ organizationId }: Arguments) {
        // console.log("Delete Event in API by Organization Id")
        const deleteResult = await this.event.destroy({ where: { organizationId } })
        // console.log(deleteResult)
        return deleteResult
    }
}