// 待办事项model

function User_PermissionModel(sequelize, DataTypes) {
	const User_Permission = sequelize.define('USER_PERMISSION', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			comment: 'ID'
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '是否展示大图标, 0:不展示, 1: 展示'
        }
	}, {
		freezeTableName: true,
		updatedAt: false,
		charset: 'utf8',
		collate: 'utf8_general_ci'
	});

	return User_Permission;
}

export default User_PermissionModel;