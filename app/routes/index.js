import Router from 'koa-router';
import user from './user.server.routes';

export default function routes(app) {
	const router = new Router();
	// 加载user路由
	user(router);

	app.use(router.routes());
	app.use(router.allowedMethods());
}