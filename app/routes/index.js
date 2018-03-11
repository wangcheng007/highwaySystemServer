import CSRF from 'koa-csrf';
import Router from 'koa-router';
import user from './user.server.routes';
import teacher from './teacher.server.routes';

export default function routes(app) {
	const router = new Router();
	// 加载user路由
	user(router);
	teacher(router);

	app.use(new CSRF());
	app.use(router.routes());
	app.use(router.allowedMethods());
}