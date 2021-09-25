import { DataSource } from 'apollo-datasource'

export default class API extends DataSource {
  organization
  location
  event
  constructor(organization: any = {}, location: any = {}, event: any = {}) {
    super();
    this.organization = organization;
    this.location = location;
    this.event = event
  }
}

