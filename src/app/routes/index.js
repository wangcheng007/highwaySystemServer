import Router from 'koa-router';
import user from './user.server.routes';
import permission from './permission.server.routes';
import level from './level.server.routes';
import file from './file.server.routes';
import department from './department.server.routes';

export default function routes(app) {
	const router = new Router();
	// 加载user路由
	user(router);

	// 加载permission路由 
	permission(router);

	// 加载level路由
	level(router);

	// 加载department路由
	department(router);

	// 加载file路由
	file(router);

	app.use(router.routes());
	app.use(router.allowedMethods());
}