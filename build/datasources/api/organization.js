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
        const resultsArray = await this.organization.update({ name }, {
            where: {
                id
            }
        });
        const resultFind = await this.getOrganization({ id });
        return resultFind.dataValues;
    }
    async deleteOrganization({ id }) {
        const deleteResult = await this.organization.destroy({ where: { id } });
        return deleteResult;
    }
}
exports.default = Organization;
