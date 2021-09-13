# GraphQL-Server

## Summary
This is a graphql-server that hosts a sqlite database of organizations, locations, and events. 

## Development
This server is created using [Apollo](https://www.apollographql.com/) which offers quick scaffolding of GraphQL servers that can run in a variety of development environments.

This project was also developed using [Node.js](https://nodejs.org/en/). `Please ensure that you have the latest
version of Node.js installed before running this project`.

## Run
To run this project, run the following command in the console
```console
npm install && npm start
```

Once run, visit the url [http://localhost:4000](http://localhost:4000) to begin querying and mutating the database.

## Data Structure
The structure of each of the Data Models is designed as seen below. Each of these structures are then reflected in the `typeDefs` of Graphql.
```js
// An organization can have many Locations and Events
Organization = {
    name: String
    createdAt: Date,
    updatedAt: Date,
}

// Locations belong to an Organization
Location = {
    name: String
    address: String
    latitude: Float
    longitude: Float
    createdAt: Date,
    updatedAt: Date,
    organizationId: Integer,
}

// Events belong to an Organization
Event = {
    name: String
    dateAndTime: Date
    description: String
    createdAt: Date
    updatedAt: Date
    organizationId: Integer
}
```

## Creating an Event
In order to create an event you must create a JSON readable timestring or get the milliseconds which you can make easily in the `chrome console`. Check out the link [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toJSON) to learn more but essentially we will get this:
```js
const event = new Date();

// you can change the event date like this
// event.setDate(25)
// event.setMonth(10)
// event.setHours(20)

const jsonDate = event.toJSON();
console.log(jsonDate);
// '2021-09-13T05:04:33.141Z'
//or
const milliseconds = event.getTime()
console.log(milliseconds)
// 1631509350703
```

Finally, in the Apollo console you can submit a date and time link this
```json
{
"createEventDateAndTime":"2021-09-13T05:04:33.141Z" or "1631509350703"
}
```



## Creating a Location
In order to create a location , you must enter a valid address so the [Google Maps API](https://developers.google.com/maps/documentation/geocoding/overview) can get the `latitude` and `longitude` coordinates of the entered address.

Here is Google's instructions to input a valid address:

>Specify addresses in accordance with the format used by the national postal service of the country concerned.
Additional address elements such as business names and unit, suite or floor numbers should be avoided. 
Street address elements should be delimited by spaces


Following the statment above, an example address for the United States would look like this
```json
{
    "createLocationAddress": "111 8th Ave, New York, NY 10011" 
}
```
