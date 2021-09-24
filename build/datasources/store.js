"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const createStore = () => {
    const db = new sequelize_1.Sequelize({
        logging: false,
        dialect: "sqlite",
        storage: "./storage.sqlite",
    });
    const organization = db.define("organization", {
        name: {
            type: sequelize_1.DataTypes.STRING,
            validate: {
                notEmpty: {
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
            type: sequelize_1.DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "Name Required"
                },
                len: {
                    args: [4, 40],
                    msg: "Name length not within range 4-40"
                }
            }, allowNull: false
        },
        address: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        latitude: { type: sequelize_1.DataTypes.FLOAT, allowNull: false },
        longitude: { type: sequelize_1.DataTypes.FLOAT, allowNull: false },
        organizationId: { type: sequelize_1.DataTypes.INTEGER },
    });
    const event = db.define("event", {
        name: {
            type: sequelize_1.DataTypes.STRING,
            validate: {
                notEmpty: {
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
            type: sequelize_1.DataTypes.DATE,
            validate: {
                isDate: {
                    msg: "Must be a valid date",
                    args: true
                }
            },
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        organizationId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
    });
    db.authenticate();
    db.sync();
    return { db, organization, location, event };
};
exports.default = createStore;
