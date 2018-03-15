import * as user from '../controllers/user.server.controller';

export default function(router) {
	// 登录
	router.post('/user/login', user.login);

	// 退出登录
	router.get('/user/logout', user.logout);

	// 获取登录信息
	router.get('/user/info', user.info);

	// 获取人员权限信息
	router.get('/user/getPerssion', user.getPermissionByUserId);

	return router;
}