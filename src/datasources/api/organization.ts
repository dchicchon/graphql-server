// organziation file
import { Model, ModelCtor } from 'sequelize/types';
import { CreateOrganizationArguments, UpdateOrganizationArguments, FindOrganizationArguments, DeleteOrganizationArguments } from '../../interfaces/OrganizationTypes';

export default class Organization {
    organization
    constructor(organization: ModelCtor<Model>) {
        this.organization = organization
    }

    async createOrganization({ name }: CreateOrganizationArguments) {
        const [organization, created] = await this.organization.findOrCreate({
            where: {
                name,
            },
        });
        return organization
    }

    async getOrganization({ id }: FindOrganizationArguments) {
        const organization = await this.organization.findOne({
            where: { id },
        });
        return organization
    }

    async getOrganizations({ ids }: FindOrganizationArguments) {
        if (ids) {
            return Promise.all(ids.map((id) => this.getOrganization({ id })));
        }
    }
    async getAllOrganizations() {
        const organizations = await this.organization.findAll();
        return organizations;
    }

    async updateOrganization(updateOrganizationObject: UpdateOrganizationArguments) {
        const resultsArray = await this.organization.update(
            updateOrganizationObject,
            {
                where: {
                    id: updateOrganizationObject.id
                }
            });
        const resultFind = await this.getOrganization({ id: updateOrganizationObject.id })
        return resultFind;
    }

    async deleteOrganization({ id }: DeleteOrganizationArguments) {
        const deleteResult = await this.organization.destroy({ where: { id } })
        return deleteResult
    }





}