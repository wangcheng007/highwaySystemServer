// 通知model
function NoticeModel(sequelize, DataTypes) {
	const Notice = sequelize.define('Notice', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true,
			comment: 'ID'
        },
        create_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            comment: '创建者id'
        },
		notice_title: {
			type: DataTypes.STRING,
			comment: 'notice title'
        },
        notice_content: {
			type: DataTypes.TEXT,
			comment: 'notice content'
        }
	}, {
		freezeTableName: true,
		updatedAt: false,
		charset: 'utf8',
		collate: 'utf8_general_ci'
	});

	return Notice;
}

export default NoticeModel;