import { DataSource } from 'apollo-datasource'
import { Arguments, CreateEventArguments, CreateLocationArguments, CreateOrganizationArguments, Store, UpdateObject } from '../../interfaces/Types'

export default class API extends DataSource {
  organization
  location
  event
  constructor(organization: any, location: any, event: any) {
    super();
    this.organization = organization;
    this.location = location;
    this.event = event
  }

  // Make sure to leave functions that involve multiple apis here

  async deleteOrganization({ id, }: Arguments) {
    const organization = await this.organization.destroy({ where: { id }, });

    // delete all events and locations associated with this organization if they exist
    await this.location.destroy({
      where: {
        organizationId: id
      }
    })
    await this.event.destroy({
      where: {
        organizationId: id
      }
    })

    return !!organization;
  }


  // END DELETE
}

