// 部门model
function DepartmentModel(sequelize, DataTypes) {
	const Department = sequelize.define('DEPARTMENT', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
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