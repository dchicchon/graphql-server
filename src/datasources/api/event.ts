
import { Arguments, } from '../../interfaces/Types'
import { CreateEventArguments, FindEventArguments, UpdateEventArguments, DeleteEventArguments } from '../../interfaces/EventTypes';
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


    async getEvent({ id }: FindEventArguments) {
        const event = await this.event.findOne({ where: { id } });
        return event;
    }


    async getEvents({ ids }: FindEventArguments) {
        if (ids) {
            return Promise.all(ids.map((id) => this.getEvent({ id })));
        }
    }


    async getAllEvents() {
        const events = await this.event.findAll();
        return events

    }


    async getAllEventsByOrgId({ id }: FindEventArguments) {
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
    async updateEvent({ id, name, dateAndTime, description }: UpdateEventArguments) {
        // console.log('Update Event')
        const updateObject: any = {}
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


    async deleteEvent({ id }: DeleteEventArguments) {
        const event = await this.event.destroy({ where: { id } });
        return event;
    }

    async deleteEventByOrganizationId({ organizationId }: DeleteEventArguments) {
        // console.log("Delete Event in API by Organization Id")
        const deleteResult = await this.event.destroy({ where: { organizationId } })
        // console.log(deleteResult)
        return deleteResult
    }
}