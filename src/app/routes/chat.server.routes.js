import * as chat from '../controllers/chat.server.controller';

export default function(router) {
    // 初始化
    router.get('/chat/getRecentConcats', chat.getRecentConcats);

    router.get('/chat/getRecentMessage', chat.getRecentMessage);
    
    router.get('/chat/newMessage', chat.newMessage);

    router.get('/chat/readUnreadMessage', chat.readUnreadMessage);

    return router;
}