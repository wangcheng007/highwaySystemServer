// 职位表

function LevelModel(sequelize, DataTypes) {
	const Level = sequelize.define('LEVEL', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			comment: 'ID'
        },
        level_name: {
            type: DataTypes.STRING,
			comment: '3: 员工, 2: 主管, 1: 管理员'
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

	return Level;
}

export default LevelModel;