module.exports = function(sequelize, DataTypes) {
	const User = sequelize.define('User', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true,
			comment: 'ID'
		},
		username: {
			type: DataTypes.STRING
		},
		password: {
			type: DataTypes.STRING
		}
	}, {
		paranoid: true,
		freezeTableName: true,
		updatedAt: false
	});

	return User;
}