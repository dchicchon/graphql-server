"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_datasource_1 = require("apollo-datasource");
class API extends apollo_datasource_1.DataSource {
    constructor(organization = {}, location = {}, event = {}) {
        super();
        this.organization = organization;
        this.location = location;
        this.event = event;
    }
}
exports.default = API;
