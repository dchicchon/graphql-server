const { Sequelize, DataTypes } = require("sequelize");

module.exports.createStore = () => {
  const db = new Sequelize({
    dialect: "sqlite",
    storage: "./storage.sqlite",
  });

  // Make tables here for our database
  const organization = db.define("organization", {
    name: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE, defaultValue: Date.now() },
    updatedAt: { type: DataTypes.DATE, defaultValue: Date.now() },
  });

  const location = db.define("location", {
    name: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    latitude: { type: DataTypes.STRING },
    longitude: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE, defaultValue: Date.now() },
    updatedAt: { type: DataTypes.DATE, defaultValue: Date.now() },
    organizationId: { type: DataTypes.INTEGER },
  });

  const event = db.define("event", {
    name: { type: DataTypes.STRING },
    dateAndTime: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE, defaultValue: Date.now() },
    updatedAt: { type: DataTypes.DATE, defaultValue: Date.now() },
    organizationId: { type: DataTypes.INTEGER },
  });

  // Look into using this in order to cascade delete
  // Relationships
  // organization.hasMany(location)
  // organization.hasMany(event)
  // location.hasOne(organization)
  // event.hasOne(organization)

  db.authenticate();
  db.sync();
  return { db, organization, location, event };
};
