// 车辆品牌表

function CarTypeModel(sequelize, DataTypes) {
	const CarType = sequelize.define('CARTYPE', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			comment: 'ID'
        },
        cartype_name: {
            type: DataTypes.STRING,
			comment: '车辆品牌'
        }
	}, {
		freezeTableName: true,
		updatedAt: false,
		charset: 'utf8',
		collate: 'utf8_general_ci'
	});

	return CarType;
}

export default CarTypeModel;