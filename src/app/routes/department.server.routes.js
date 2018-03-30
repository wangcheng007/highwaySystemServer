import * as department from '../controllers/department.server.controller';

export default function(router) {
    // 获取所有的职位
	router.get('/department/getDepartments', department.getDepartments);

    return router;
}