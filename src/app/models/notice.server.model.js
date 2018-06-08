// 通知model
function NoticeModel(sequelize, DataTypes) {
	const Notice = sequelize.define('NOTICE', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			comment: 'ID'
        },
        create_id: {
            type: DataTypes.STRING,
            comment: '创建者id'
        },
		notice_title: {
			type: DataTypes.STRING,
			comment: 'notice title'
        },
        notice_content: {
			type: DataTypes.TEXT,
			comment: 'notice content'
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

	return Notice;
}

export default NoticeModel;