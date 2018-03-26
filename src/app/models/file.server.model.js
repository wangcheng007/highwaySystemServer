// 文件model
function FileModel(sequelize, DataTypes) {
	const File = sequelize.define('FILE', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			comment: 'ID'
		},
		file_name: {
			type: DataTypes.STRING,
			comment: 'file name'
        }, 
        file_path: {
            type: DataTypes.STRING,
			comment: 'file path'
        }, 
        file_des: {
            type: DataTypes.STRING,
			comment: 'file des'
        }
	}, {
		freezeTableName: true,
		updatedAt: false,
		charset: 'utf8',
		collate: 'utf8_general_ci'
	});

	return File;
}

export default FileModel;