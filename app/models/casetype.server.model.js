// 案件类型model
function CaseTypeModel(sequelize, DataTypes) {
	const CaseType = sequelize.define('CaseType', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true,
			comment: 'ID'
		},
		case_type_name: {
			type: DataTypes.STRING,
			comment: 'case title'
        }
	}, {
		freezeTableName: true,
		updatedAt: false,
		charset: 'utf8',
		collate: 'utf8_general_ci'
	});

	return CaseType;
}

export default CaseTypeModel;