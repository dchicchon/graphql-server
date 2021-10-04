import { Sequelize, DataTypes, Model, ModelCtor } from 'sequelize'
import { OrganizationType } from '../interfaces/OrganizationTypes';

export const createStore = () => {
  const db = new Sequelize({
    logging: false,
    dialect: 'sqlite',
    storage: './storage.sqlite',
  });

  const organization: ModelCtor<Model> = db.define('organization', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Name Required'
        },
        len: {
          args: [4, 40],
          msg: 'Name length not within range 4-40'
        }
      },
      allowNull: false,
    },
  });

  const location = db.define('location', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          // args: true,
          msg: 'Name Required'
        },
        len: {
          args: [4, 40],
          msg: 'Name length not within range 4-40'
        }
      }, allowNull: false
    },
    address: { type: DataTypes.STRING, allowNull: false },
    latitude: { type: DataTypes.FLOAT, allowNull: false },
    longitude: { type: DataTypes.FLOAT, allowNull: false },
    organizationId: { type: DataTypes.INTEGER },
  });

  const event = db.define('event', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          // args: true,
          msg: 'Name Required'
        },
        len: {
          args: [4, 40],
          msg: 'Name length not within range 4-40'
        }
      },
      allowNull: false,
    },
    dateAndTime: {
      type: DataTypes.DATE,
      validate: {
        isDate: {
          msg: 'Must be a valid date',
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
  db.sync();
  return { db, organization, location, event };
}

export const createTestStore = () => {
  const db = new Sequelize({
    logging: false,
    dialect: 'sqlite',
    storage: './testStorage.sqlite',
  });

  // Make tables here for our database
  const organization = db.define('organization', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Name Required'
        },
        len: {
          args: [4, 40],
          msg: 'Name length not within range 4-40'
        }
      },
      allowNull: false,
    },
  });

  const location = db.define('location', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          // args: true,
          msg: 'Name Required'
        },
        len: {
          args: [4, 40],
          msg: 'Name length not within range 4-40'
        }
      }, allowNull: false
    },
    address: { type: DataTypes.STRING, allowNull: false },
    latitude: { type: DataTypes.FLOAT, allowNull: false },
    longitude: { type: DataTypes.FLOAT, allowNull: false },
    organizationId: { type: DataTypes.INTEGER },
  });

  const event = db.define('event', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          // args: true,
          msg: 'Name Required'
        },
        len: {
          args: [4, 40],
          msg: 'Name length not within range 4-40'
        }
      },
      allowNull: false,
    },
    dateAndTime: {
      type: DataTypes.DATE,
      validate: {
        isDate: {
          msg: 'Must be a valid date',
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
  db.sync();
  return { db, organization, location, event };
}
