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
  });

  const location = db.define("location", {
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
      }, allowNull: false
    },
    address: { type: DataTypes.STRING, allowNull: false },
    latitude: { type: DataTypes.FLOAT, allowNull: false },
    longitude: { type: DataTypes.FLOAT, allowNull: false },
    organizationId: { type: DataTypes.INTEGER },
  });

  const event = db.define("event", {
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
    dateAndTime: {
      type: DataTypes.DATE,
      validate: {
        isDate: {
          msg: "Must be a valid date",
          args: true
        }
      },
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organizationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  db.authenticate();
  db.sync(); // sync the models with our databse
  return { db, organization, location, event };
};
