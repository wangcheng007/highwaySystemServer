import Router from 'koa-router';
import user from './user.server.routes';
import teacher from './teacher.server.routes';

export default function routes(app) {
	const router = new Router();
	// 加载user路由
	user(router);
	teacher(router);

	// async function injectParams(ctx, next) {
	// 	// ctx.state.env = config.env;
	// 	ctx.state.user = ctx.session.user;
	// 	console.log(ctx.session);
	// 	// ctx.state.year = (new Date()).getFullYear();
	// 	// ctx.state.cdnDomain = config.cdn.domain;
	// 	ctx.cookies.set('XSRF-TOKEN', ctx.csrf, {
	// 	  	httpOnly: false
	// 	});
	// 	await next();
	// }
	
	// app.use(injectParams);
	app.use(router.routes());
	app.use(router.allowedMethods());
}