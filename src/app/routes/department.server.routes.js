import * as department from '../controllers/department.server.controller';

export default function(router) {
    // 获取所有的部门
	router.get('/department/getDepartments', department.getDepartments);

    // 初始化
    router.get('/department/initDepartnemt', department.initDepartnemt);
    
    // 新增部门
    router.post('/department/addDepartment', department.addDepartment);

    return router;
}