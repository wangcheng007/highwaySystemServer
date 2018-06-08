// 车辆信息model

function CarModel(sequelize, DataTypes) {
	const Car = sequelize.define('CAR', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			comment: 'ID'
        },
        car_time: {
            type: DataTypes.BIGINT.UNSIGNED,
			comment: '车辆注册时间'
        },
        car_id: {
            type: DataTypes.STRING,
            comment: '车牌号'
        },
        car_status: {
            type: DataTypes.INTEGER,
            comment: '0: 待审核, 1: 待归档, 2: 退回, 3: 已归档'
        },
        agent_id: {
            type: DataTypes.STRING,
            comment: '经办人id'
        },
        car_imgs: {
            type: DataTypes.STRING,
            comment: '多个图片用,隔开'
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

	return Car;
}

export default CarModel;