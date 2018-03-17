// 部门model
function DepartmentModel(sequelize, DataTypes) {
	const Department = sequelize.define('Department', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true,
			comment: 'ID'
		},
		department_name: {
			type: DataTypes.STRING,
			comment: 'department name'
		}
	}, {
		freezeTableName: true,
		updatedAt: false,
		charset: 'utf8',
		collate: 'utf8_general_ci'
	});

	return Department;
}

export default DepartmentModel;