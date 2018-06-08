// 驾驶员信息

function DriverModel(sequelize, DataTypes) {
	const Driver = sequelize.define('DRIVER', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			comment: 'ID'
        },
        name: {
            type: DataTypes.STRING,
        },
        phoneNumber: {
            type: DataTypes.INTEGER
        },
        header_img: {
            type: DataTypes.STRING
        }, 
        id_card_img: {
            type: DataTypes.STRING
        },
        license_img: {
            type: DataTypes.STRING
        },
        id_card: {
            type: DataTypes.STRING
        },
        license: {
            type: DataTypes.STRING
        }
	}, {
		freezeTableName: true,
		updatedAt: false,
        createdAt: false,
		charset: 'utf8',
		collate: 'utf8_general_ci'
	});

	return Driver;
}

export default DriverModel;