import { DataSource } from 'apollo-datasource'
import Event from './event';
import Location from './location';
import Organization from './organization';

export default class API extends DataSource {
  organization
  location
  event
  constructor(organization: Organization, location: Location, event: Event) {
    super();
    this.organization = organization;
    this.location = location;
    this.event = event
  }
}

