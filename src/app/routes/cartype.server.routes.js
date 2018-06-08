import * as cartype from '../controllers/cartype.server.controller';

export default function(router) {
    // 初始化
    router.get('/cartype/initCartype', cartype.initCartype);

    // 新增
    router.post('/cartype/addCartype', cartype.addCartype);
    
    router.get('/cartype/getCartypes', cartype.getCartypes);
    
    router.post('/cartype/addCartypes', cartype.addCartypes);
    
    return router;
}