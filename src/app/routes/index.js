import Router from 'koa-router';
import user from './user.server.routes';
import permission from './permission.server.routes';
import level from './level.server.routes';
import file from './file.server.routes';
import department from './department.server.routes';
import notofication from './notification.server.routes';
import caseManage from './case.server.routers';
import casetype from './casetype.server.routes';
import chat from './chat.server.routes';
import car from './car.server.routes';
import cartype from './cartype.server.routes';
import driver from './driver.server.routes';
import todo from './todo.server.routes';

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

	// 加载notification 路由
	notofication(router);

	// 加载case 路由
	caseManage(router);

	// 加载casetype 路由
	casetype(router);

	// 加载chat路由
	chat(router);

	// 加载car路由
	car(router);
	cartype(router);
	driver(router);
	todo(router);

	app.use(router.routes());
	app.use(router.allowedMethods());
}