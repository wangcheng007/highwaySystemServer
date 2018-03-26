#!/user/bin.env node

import app from '../app';
import config from '../config/config';

import  easyMonitor from 'easy-monitor';
easyMonitor('highwaySystemServer');

if (!module.parent) {
	const port = config.port || 3000;
	app.listen(port);
	console.log('Running site at: http://127.0.0.1:' + port);
}