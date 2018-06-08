// 车辆品牌表

function Car_CartypeModel(sequelize, DataTypes) {
	const Car_Cartype = sequelize.define('CAR_CARTYPE', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			comment: 'ID'
        }
	}, {
		freezeTableName: true,
		updatedAt: false,
        createdAt: false,
		charset: 'utf8',
		collate: 'utf8_general_ci'
	});

	return Car_Cartype;
}

export default Car_CartypeModel;