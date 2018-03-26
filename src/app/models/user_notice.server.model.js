function User_NoticeModel(sequelize, DataTypes) {
	const User_Notice = sequelize.define('USER_NOTICE', {
        id: {
			type: DataTypes.STRING,
			primaryKey: true,
			comment: 'ID'
        },
        status: {
            type: DataTypes.INTEGER,
            comment: '是否已读, 0: 未读, 1: 已读'
        }
	}, {
		freezeTableName: true,
		updatedAt: false,
		charset: 'utf8',
		collate: 'utf8_general_ci'
	});

	return User_Notice;
}

export default User_NoticeModel;