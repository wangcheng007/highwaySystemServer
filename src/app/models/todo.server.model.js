// 待办事项model

function TodoModel(sequelize, DataTypes) {
	const Todo = sequelize.define('TODO', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			comment: 'ID'
		},
		type: {
			type: DataTypes.INTEGER,
			comment: '0: 车辆管理, 1: 案件管理'
		},
		associatedID: {
			type: DataTypes.STRING
		},
        status: {
            type: DataTypes.INTEGER,
			comment: '0: 未读, 1: 已读'
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

	return Todo;
}

export default TodoModel;