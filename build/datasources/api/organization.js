"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Organization {
    constructor(organization) {
        this.organization = organization;
    }
    async createOrganization({ name }) {
        const [organization, created] = await this.organization.findOrCreate({
            where: {
                name,
            },
        });
        return organization.dataValues;
    }
    async getOrganization({ id }) {
        const organization = await this.organization.findOne({
            where: { id },
        });
        return organization;
    }
    async getOrganizations({ ids }) {
        if (ids) {
            return Promise.all(ids.map((id) => this.getOrganization({ id })));
        }
    }
    async getAllOrganizations() {
        const organizations = await this.organization.findAll();
        return organizations;
    }
    async updateOrganization({ id, name }) {
        console.log("Update Org in API");
        const results = await this.organization.update({ name }, {
            where: {
                id
            }
        });
        console.log(results);
        return results[0];
    }
}
exports.default = Organization;
