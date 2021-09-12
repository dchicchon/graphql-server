const { Sequelize, DataTypes } = require('sequelize')

module.exports.createStore = () => {
    const db = new Sequelize({
        dialect: 'sqlite',
        storage: './storage.sqlite',
    })

    // Make tables here for our database
    const organization = db.define('organization', {
        name: { type: DataTypes.STRING },
        createdAt: { type: DataTypes.DATE },
        updatedAt: { type: DataTypes.DATE },
    })


    const location = db.define('location', {
        name: { type: DataTypes.STRING },
        address: { type: DataTypes.STRING },
        latitude: { type: DataTypes.STRING },
        longitude: { type: DataTypes.STRING },
        createdAt: { type: DataTypes.DATE },
        updatedAt: { type: DataTypes.DATE },
        organizationId: { type: DataTypes.INTEGER }
    })

    const event = db.define('event', {
        name: { type: DataTypes.STRING },
        dateAndTime: { type: DataTypes.STRING },
        description: { type: DataTypes.STRING },
        createdAt: { type: DataTypes.DATE },
        updatedAt: { type: DataTypes.DATE },
        organizationId: { type: DataTypes.INTEGER }

    })

    // Relationships
    organization.hasMany(location)
    organization.hasMany(event)
    location.hasOne(organization)
    event.hasOne(organization)

    db.authenticate()
    db.sync()
    return { db, organization, location, event }
}