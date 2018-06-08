import * as caseManage from '../controllers/case.server.controller';

export default function(router) {
    // 初始化
    router.get('/case/initCase', caseManage.initCase);

    router.get('/case/addCase', caseManage.addCase);

    router.get('/case/updateCase', caseManage.updateCase);

    router.get('/case/getCaseDetailById', caseManage.getCaseDetailById);
    
    router.get('/case/initTotalCase', caseManage.initTotalCase);
    
    return router;
}