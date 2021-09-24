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
        // console.log("Update Org in API")
        const resultsArray = await this.organization.update(
            { name },
            {
                where: {
                    id
                }
            });
        const resultFind = await this.getOrganization({ id: resultsArray[0] })
        // console.log(resultFind.dataValues)
        // might have to do a find to grab the organization 
        // and return it to the user
        return resultFind.dataValues;
    }





}