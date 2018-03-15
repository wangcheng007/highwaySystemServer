function permissionModel(sequelize, DataTypes) {
	const permission = sequelize.define('permission', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true,
			comment: 'ID'
		},
		permission_name: {
			type: DataTypes.STRING
		},
		path_router: {
			type: DataTypes.STRING
		},
		small_img: {
			type: DataTypes.STRING
        },
        big_img: {
			type: DataTypes.STRING
		}
	}, {
		freezeTableName: true,
		updatedAt: false,
		charset: 'utf8',
		collate: 'utf8_general_ci'
	});

	return permission;
}

export default permissionModel;