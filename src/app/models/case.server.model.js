// 案件model
function CaseModel(sequelize, DataTypes) {
	const Case = sequelize.define('CASE', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			comment: 'ID'
		},
		case_title: {
			type: DataTypes.STRING,
			comment: 'case title'
        },
        case_des: {
            type: DataTypes.TEXT,
            comment: 'case des'
        },
        case_status: {
            type: DataTypes.INTEGER,
            comment: '0: 待审核, 1: 待归档, 2: 退回, 3: 已归档'
        },
        agent_id: {
            type: DataTypes.STRING,
            comment: '经办人id'
        },
        case_imgs: {
            type: DataTypes.STRING,
            comment: '多个图片用,隔开'
        },
        x_point: {
            type: DataTypes.FLOAT,
            comment: '经度'
        },
        y_point: {
            type: DataTypes.FLOAT,
            comment: '维度'
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

	return Case;
}

export default CaseModel;