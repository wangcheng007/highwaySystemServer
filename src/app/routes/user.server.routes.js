import * as user from '../controllers/user.server.controller';

export default function(router) {
	// 登录
	router.post('/user/login', user.login);

	// 退出登录
	router.get('/user/logout', user.logout);

	// 获取登录信息
	router.get('/user/info', user.info);

	// 获取人员列表
	router.get('/user/getUsers', user.getUsers);

	// 新增人员
	router.post('/user/addUser', user.addUser);

	// 删除人员
	router.delete('/user/deleteUser', user.deleteUser);

	// 修改密码
	router.post('/user/updatePassword', user.updatePassword);
	
	// 修改基本信息
	router.post('/user/editUser', user.editUser);
	
	// 修改头像
	router.get('/user/changeHeaderImg', user.changeHeaderImg);

	// 获取人员和部门信息
	router.get('/user/getDepartmentAndUser', user.getDepartmentAndUser);

	return router;
}