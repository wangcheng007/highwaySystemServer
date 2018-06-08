// 案件类型model
function CaseTypeModel(sequelize, DataTypes) {
	const CaseType = sequelize.define('CASETYPE', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			comment: 'ID'
		},
		case_type_name: {
			type: DataTypes.STRING,
			comment: 'case title'
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

	return CaseType;
}

export default CaseTypeModel;