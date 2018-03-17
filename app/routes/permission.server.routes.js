import * as permission from '../controllers/permission.server.controller';

export default function(router) {
   // 获取用户权限信息
	router.get('/getPermission', permission.getPermission);

}