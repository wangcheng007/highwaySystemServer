function userModel(sequelize, DataTypes) {
	const user = sequelize.define('user', {
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
		},
		img: {
			type: DataTypes.STRING
		}
	}, {
		freezeTableName: true,
		updatedAt: false,
		charset: 'utf8',
		collate: 'utf8_general_ci'
	});

	return user;
}

export default userModel;