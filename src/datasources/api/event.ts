
import { CreateEventArguments, FindEventArguments, UpdateEventArguments, DeleteEventArguments } from '../../interfaces/EventTypes';
import { Model, ModelCtor } from 'sequelize/types';
export default class Event {
    event
    constructor(event: ModelCtor<Model>) {
        this.event = event
    }

    async createEvent({ name, dateAndTime, description, organizationId }: CreateEventArguments) {
        const [event, created] = await this.event.findOrCreate({
            where: { name, dateAndTime: dateAndTime, description, organizationId },
        });
        return event;
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
    async updateEvent({ id, name, dateAndTime, description }: UpdateEventArguments) {
        const updateObject: any = {}
        if (name) updateObject.name = name;
        if (dateAndTime) updateObject.dateAndTime = new Date(dateAndTime)
        if (description) updateObject.description = description
        await this.event.update(updateObject,
            {
                where: {
                    id
                }
            });
        const findResults = await this.getEvent({ id })
        return findResults
    }


    async deleteEvent({ id }: DeleteEventArguments) {
        const event = await this.event.destroy({ where: { id } });
        return event;
    }

    async deleteEventByOrganizationId({ organizationId }: DeleteEventArguments) {
        const deleteResult = await this.event.destroy({ where: { organizationId } })
        return deleteResult
    }
}