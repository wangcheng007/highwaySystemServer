
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
            returnCode: '400',
            message: 'fail'
        }
    }
}
