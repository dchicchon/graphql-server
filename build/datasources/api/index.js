"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_datasource_1 = require("apollo-datasource");
class API extends apollo_datasource_1.DataSource {
    constructor(organization, location, event) {
        super();
        this.organization = organization;
        this.location = location;
        this.event = event;
    }
    async deleteOrganization({ id, }) {
        const organization = await this.organization.destroy({ where: { id }, });
        await this.location.destroy({
            where: {
                organizationId: id
            }
        });
        await this.event.destroy({
            where: {
                organizationId: id
            }
        });
        return !!organization;
    }
}
exports.default = API;
