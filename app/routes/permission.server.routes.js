import * as permission from '../controllers/permission.server.controller';

export default function(router) {
    // 获取用户权限信息
	router.get('/getPermission', permission.getPermission);

    // 获取用户暂时在首页的卡片
    router.get('/permission/getBigImgPermission', permission.getBigImgPermission);

    // 取消权限在首页展示
    router.get('/permission/deleteBigPermission', permission.deleteBigPermission);
    
    // 添加权限在首页展示
    router.get('/permission/addBigPermission', permission.addBigPermission);
}