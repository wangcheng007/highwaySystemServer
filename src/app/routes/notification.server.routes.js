import * as notification from '../controllers/notification.server.controller';

export default function(router) {

    // 初始化
    router.get('/notification/initNotification', notification.initNotification);
    
    // 新增通知
    router.post('/notification/addNotice', notification.addNotice);

    // 通过id获取notice
    router.get('/notice/getNoticeById', notification.getNoticeById);

    // 通过id获取阅读情况
    router.get('/notice/getNoticeAndUserById', notification.getNoticeAndUserById);

    router.get('/notice/getNoReadNotice', notification.getNoReadNotice);
    
    router.get('/notice/updateNoticeStatus', notification.updateNoticeStatus);

    return router;
}