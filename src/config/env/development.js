import path from 'path';

module.exports = {
	port: 3000,
	database: {
		name: 'root',
		modelPath: path.join(__dirname, '../../app/models'),
		db: 'share_games',
		username: 'root',
		password: 'root',
		dialect: 'mysql',
		host: '127.0.0.1',
		port: 3306,
		pool: {
			maxConnections: 10,
			minConnections: 0,
			maxIdleTime: 30000
		}
	},
	keys: ['share games'],
	session: {
		key: 'koa:sess', // cookie key
		maxAge: 86400000, // maxAge in ms
		overwrite: true, // can overwrite or not
		httpOnly: true, // httpOnly or not
		signed: true, // signed or not
		rolling: false, 
		renew: false
	},
	allowOrign: ['http://127.0.0.1:8001']
}