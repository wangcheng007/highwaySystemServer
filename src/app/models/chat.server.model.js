// 聊天记录 model
function ChatModel(sequelize, DataTypes) {
	const Chat = sequelize.define('CHAT', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			comment: 'ID'
		},
		sender_id: {
			type: DataTypes.STRING,
			comment: 'sender id'
        },
        recipient_id: {
            type: DataTypes.STRING,
            comment: 'recipient id'
		},
		status: {
            type: DataTypes.INTEGER,
            comment: 'message status'
        },
        message: {
            type: DataTypes.STRING,
            comment: 'sender message'
        },
        last_update: {
            type: DataTypes.STRING,
            comment: 'last sender time'
        }
	}, {
		freezeTableName: true,
		updatedAt: false,
        createdAt: false,
		charset: 'utf8',
		collate: 'utf8_general_ci'
	});

	return Chat;
}

export default ChatModel;