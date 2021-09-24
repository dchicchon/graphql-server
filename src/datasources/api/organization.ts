// organziation file
import { Arguments, CreateOrganizationArguments } from '../../interfaces/Types'

export default class Organization {
    organization
    constructor(organization: any) {
        this.organization = organization
    }

    async createOrganization({ name }: CreateOrganizationArguments) {
        // console.log("Creating Organization")
        const [organization, created] = await this.organization.findOrCreate({
            where: {
                name,
            },
        });
        // console.log(organization)
        return organization.dataValues
        // return created ? organization.dataValues : { message: "Organization Already Created" };
    }

    async getOrganization({ id }: Arguments) {
        const organization = await this.organization.findOne({
            where: { id },
        });
        // console.log("Getting organization")
        // console.log(organization)
        return organization
    }

    async getOrganizations({ ids }: Arguments) {
        if (ids) {
            return Promise.all(ids.map((id) => this.getOrganization({ id })));
        }
    }
    async getAllOrganizations() {
        const organizations = await this.organization.findAll();
        return organizations;
    }

    async updateOrganization({ id, name }: Arguments) {
        const results = await this.organization.update(
            { name },
            {
                where: {
                    id
                }
            });
        return results[0];
    }





}