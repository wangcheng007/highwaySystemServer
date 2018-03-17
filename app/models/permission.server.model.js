// 权限model
function PermissionModel(sequelize, DataTypes) {
	const Permission = sequelize.define('Permission', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true,
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
            type: DataTypes.BIGINT.UNSIGNED,
            comment: 'parent id'
		},
		small_img: {
            type: DataTypes.STRING,
            comment: 'nav slider img'
        },
        big_img: {
            type: DataTypes.STRING,
            comment: 'main img'
		}
	}, {
		freezeTableName: true,
		updatedAt: false,
		charset: 'utf8',
		collate: 'utf8_general_ci'
	});

	return Permission;
}

export default PermissionModel;