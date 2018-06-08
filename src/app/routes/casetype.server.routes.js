import * as casetype from '../controllers/casetype.server.controller';

export default function(router) {
    // 初始化
    router.get('/casetype/initCaseType', casetype.initCaseType);

    // 新增
    router.post('/casetype/addCasetype', casetype.addCasetype);

    router.get('/casetype/getCaseTypeList', casetype.getCaseTypeList);

    return router;
}