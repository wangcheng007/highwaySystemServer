function initTables(sequelize, DataTypes) {
    const user = sequelize.import('./user.server.model.js');
    const permission = sequelize.import('./permission.server.model.js');

	user.belongsToMany(permission, {through: 'user_permission'});

    return user;
}

export default initTables;