module.exports = function(sequelize, DataTypes) {
	const User = sequelize.define('User', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true,
			comment: 'ID'
		}
	});

	return User;
}