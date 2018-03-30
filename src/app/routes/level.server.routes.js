import * as level from '../controllers/level.server.controller';

export default function(router) {
    // 获取所有的职位
	router.get('/level/getLevels', level.getLevels);

    return router;
}