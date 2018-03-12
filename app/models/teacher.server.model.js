module.exports = function(sequelize, DataTypes) {
	const Teacher = sequelize.define('Teacher', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true,
			comment: 'ID'
		}
	}, {
		paranoid: true,
		freezeTableName: true,
		updatedAt: false
	});


	return Teacher;
}