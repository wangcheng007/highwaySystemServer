// 人员model
function UserModel(sequelize, DataTypes) {
	const User = sequelize.define('User', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true,
			comment: 'ID'
		},
		username: {
			type: DataTypes.STRING,
			comment: 'user name'
		},
		password: {
			type: DataTypes.STRING,
			comment: 'user password'
		},
		img: {
			type: DataTypes.STRING,
			comment: 'user header img'
		}
	}, {
		freezeTableName: true,
		updatedAt: false,
		charset: 'utf8',
		collate: 'utf8_general_ci'
	});

	return User;
}

export default UserModel;