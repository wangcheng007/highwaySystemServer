
// 获取department列表
export async function getAllDepartment(ctx, next) {
    const { DEPARTMENT } = ctx.orm();

    let departmentList = await DEPARTMENT.findAll({
        attributes: [['id', 'value'], ['department_name', 'label']]
    });

    return departmentList;
}