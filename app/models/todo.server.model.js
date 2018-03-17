// 待办事项model

function TodoModel(sequelize, DataTypes) {
	const Todo = sequelize.define('Todo', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true,
			comment: 'ID'
        },
        status: {
            type: DataTypes.INTEGER,
			comment: '0: 未读, 1: 已读'
        }
	}, {
		freezeTableName: true,
		updatedAt: false,
		charset: 'utf8',
		collate: 'utf8_general_ci'
	});

	return Todo;
}

export default TodoModel;