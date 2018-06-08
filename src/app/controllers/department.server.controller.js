import Sequelize from 'sequelize';
import uuidV4 from 'uuid/v4';

// 获取department列表
export async function getAllDepartment(ctx, next) {
    const { DEPARTMENT } = ctx.orm();

    let departmentList = await DEPARTMENT.findAll({
        attributes: [['id', 'value'], ['department_name', 'label']]
    });

    return departmentList;
}

// 获取department列表
export async function getDepartments(ctx, next) {
    const { DEPARTMENT } = ctx.orm();

    let departmentList = await DEPARTMENT.findAll({
        attributes: [['id', 'value'], ['department_name', 'label']]
    });

    if (departmentList && departmentList.length) {
        ctx.body = {
            data:{
                departmentList
            },
            returnCode: '1001',
            message: 'success'
        }
    } else {
        ctx.body = {
            data:{},
            returnCode: '4004',
            message: 'fail'
        }
    }
}

// 初始化
export async function initDepartnemt(ctx, next) {
    const { DEPARTMENT, USER } = ctx.orm();
    const { currentPage, pageSize, department_name } = ctx.query;

    let whereStat = {};

	if (department_name) {
		whereStat.department_name = department_name;
    }
    
    const query = [{
		type: 'text',
		lable: '名称',
		name: 'department_name',
		placeholder: '请输入部门名称'
    }];
    
    const columns = [{
		label: '部门名称',
		align: 'center',
        prop: 'department_name'
	}, {
		label: '主管',
		align: 'center',
        prop: 'managers'
	}, {
		label: '人数',
		align: 'center',
        prop: 'count'
	}, {
		label: '创建时间',
		align: 'center',
		prop: 'createtime',
		width: '200'
	}];

    let departments = await DEPARTMENT.findAll({
        where: {
			...whereStat
		},
        include: [
            {
                model: USER
            }
        ],
        offset: parseInt((currentPage - 1) * pageSize),
		limit: parseInt(pageSize),
        order: [
            ['time_stamp', 'DESC']
        ]
    });

    let datas = [];
    departments.forEach(department => {
        let obj = {};

        obj.department_name = department.department_name;
        obj.count = department.USERs.length;
        obj.createtime = department.time_stamp;
        obj.managers = [];

        department.USERs && department.USERs.length ? department.USERs.forEach((user) => {
            if (user.LEVELId === '2') {
                obj.managers.push(user.username);
            }
        }) : null;

        obj.managers = obj.managers.join();
        datas.push(obj);
    });


    ctx.body = {
        data: {
            query,
            columns,
            datas
		},
		returnCode: '1001',
		message: 'success' 
    }
}

export async function addDepartment(ctx) {
    const { DEPARTMENT } = ctx.orm();

    let data = ctx.request.body;
    data.id = uuidV4();
    data.time_stamp = Date.now() + '';

    let departments = await DEPARTMENT.findAll({
		where: {
			department_name: data.department_name
		}
    });
    
    if (departments && departments.length) {
		ctx.body = {
			data: {},
			returnCode: '4000',
			message: '该部门已存在' 
		}

		return;
    }

    let flag = await DEPARTMENT.create(data);
    if (flag) {
		ctx.body = {
			data: {
				flag: flag
			},
			returnCode: '1001',
			message: 'success' 
		}
	} else {
		ctx.body = {
			data: {},
			returnCode: '2002',
			message: 'fail' 
		}
	}
}
