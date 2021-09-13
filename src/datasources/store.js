const { Sequelize, DataTypes } = require("sequelize");

module.exports.createStore = () => {
  const db = new Sequelize({
    logging: false,
    dialect: "sqlite",
    storage: "./storage.sqlite",
  });

  // Make tables here for our database
  const organization = db.define("organization", {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Name Required"
        },
        len: {
          args: [4, 40],
          msg: "Name length not within range 4-40"
        }
      },
      allowNull: false,
    },
    createdAt: { type: DataTypes.DATE, defaultValue: new Date() },
    updatedAt: { type: DataTypes.DATE, defaultValue: new Date() },
  });

  const location = db.define("location", {
    name: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    latitude: { type: DataTypes.FLOAT, allowNull: false },
    longitude: { type: DataTypes.FLOAT, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: new Date(), allowNull: false, },
    updatedAt: { type: DataTypes.DATE, defaultValue: new Date(), allowNull: false },
    organizationId: { type: DataTypes.INTEGER },
  });

  const event = db.define("event", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateAndTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE, defaultValue: new Date(),
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE, defaultValue: new Date(),
      allowNull: false,
    },
    organizationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
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
