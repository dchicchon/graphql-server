// organziation file
import { CreateOrganizationArguments, UpdateOrganizationArguments, FindOrganizationArguments, DeleteOrganizationArguments } from '../../interfaces/OrganizationTypes';

export default class Organization {
    organization
    constructor(organization: any) {
        this.organization = organization
    }

    async createOrganization({ name }: CreateOrganizationArguments) {
        // console.log('Creating Organization')
        const [organization, created] = await this.organization.findOrCreate({
            where: {
                name,
            },
        });
        // console.log(organization)
        return organization.dataValues
        // return created ? organization.dataValues : { message: 'Organization Already Created' };
    }

    async getOrganization({ id }: FindOrganizationArguments) {
        const organization = await this.organization.findOne({
            where: { id },
        });
        // console.log('Getting organization')
        // console.log(organization)
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

    async updateOrganization({ id, name }: UpdateOrganizationArguments) {
        // console.log('Update Org in API')

        // Returns an array [rows affected, ]
        const resultsArray = await this.organization.update(
            { name },
            {
                where: {
                    id
                }
            });
        // console.log('API Result')
        // console.log(resultsArray)

        const resultFind = await this.getOrganization({ id })
        // might have to do a find to grab the organization 
        // and return it to the user
        return resultFind;
    }

    async deleteOrganization({ id }: DeleteOrganizationArguments) {
        // console.log('Deleting Organization in API')
        const deleteResult = await this.organization.destroy({ where: { id } })
        // console.log(deleteResult)
        return deleteResult
    }





}