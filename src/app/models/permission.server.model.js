// 权限model
function PermissionModel(sequelize, DataTypes) {
	const Permission = sequelize.define('PERMISSION', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			comment: 'ID'
		},
		permission_name: {
            type: DataTypes.STRING,
            comment: 'permission name'
        },
        permission_order: {
            type: DataTypes.INTEGER,
            comment: '排序字段'
        },
		path_router: {
            type: DataTypes.STRING,
            comment: 'path router'
        },
        parent_id: {
            type: DataTypes.STRING,
            comment: 'parent id'
		},
		small_img: {
            type: DataTypes.STRING,
            comment: 'nav slider img'
        },
        big_img: {
            type: DataTypes.STRING,
            comment: 'main img'
		},
        time_stamp: {
            type: DataTypes.STRING,
            comment: '时间戳'
        }
	}, {
		freezeTableName: true,
		updatedAt: false,
        createdAt: false,
		charset: 'utf8',
		collate: 'utf8_general_ci'
	});

	return Permission;
}

export default PermissionModel;