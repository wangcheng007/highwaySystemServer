// 车辆信息model

function CarModel(sequelize, DataTypes) {
	const Car = sequelize.define('Car', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true,
			comment: 'ID'
        },
        car_user: {
            type: DataTypes.STRING,
			comment: '车辆使用者姓名'
        },
        car_time: {
            type: DataTypes.BIGINT.UNSIGNED,
			comment: '车辆注册时间'
        },
        car_id: {
            type: DataTypes.STRING,
            comment: '车牌号'
        }, 
        car_color: {
            type: DataTypes.STRING,
            comment: '车辆颜色'
        }
	}, {
		freezeTableName: true,
		updatedAt: false,
		charset: 'utf8',
		collate: 'utf8_general_ci'
	});

	return Car;
}

export default CarModel;