// 案件model
function CaseModel(sequelize, DataTypes) {
	const Case = sequelize.define('Cases', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true,
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
            comment: '0: 待审核, 1: 审核中, 2: 退回, 3: 审核通过并归档'
        },
        agent_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            comment: '经办人id'
        },
        case_imgs: {
            type: DataTypes.STRING,
            comment: '多个图片用,隔开'
        }
	}, {
		freezeTableName: true,
		updatedAt: false,
		charset: 'utf8',
		collate: 'utf8_general_ci'
	});

	return Case;
}

export default CaseModel;