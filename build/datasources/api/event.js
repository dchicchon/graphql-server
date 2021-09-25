"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Event {
    constructor(event) {
        this.event = event;
    }
    async createEvent({ name, dateAndTime, description, organizationId }) {
        const [event, created] = await this.event.findOrCreate({
            where: { name, dateAndTime: dateAndTime, description, organizationId },
        });
        return event.dataValues;
    }
    async getEvent({ id }) {
        const event = await this.event.findOne({ where: { id } });
        return event;
    }
    async getEvents({ ids }) {
        if (ids) {
            return Promise.all(ids.map((id) => this.getEvent({ id })));
        }
    }
    async getAllEvents() {
        const events = await this.event.findAll();
        return events;
    }
    async getAllEventsByOrgId({ id }) {
        const events = await this.event.findAll({
            where: {
                organizationId: id,
            },
        });
        return events;
    }
    async updateEvent({ id, name, dateAndTime, description }) {
        const updateObject = {};
        if (name)
            updateObject.name = name;
        if (dateAndTime)
            updateObject.dateAndTime = new Date(dateAndTime);
        if (description)
            updateObject.description = description;
        const results = await this.event.update(updateObject, {
            where: {
                id
            }
        });
        return results[0];
    }
    async deleteEvent({ id }) {
        const event = await this.event.destroy({ where: { id } });
        return !!event;
    }
    async deleteEventByOrganizationId({ organizationId }) {
        const deleteResult = await this.event.destroy({ where: { organizationId } });
        return deleteResult;
    }
}
exports.default = Event;
