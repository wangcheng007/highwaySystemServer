// 人员model
function UserModel(sequelize, DataTypes) {
	const User = sequelize.define('USER', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
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
		},
		time_stamp: {
			type: DataTypes.STRING,
			comment: '时间戳'
		}
	}, {
		freezeTableName: true,
		createdAt: false,
		updatedAt: false,
		charset: 'utf8',
		collate: 'utf8_general_ci'
	});

	return User;
}

export default UserModel;