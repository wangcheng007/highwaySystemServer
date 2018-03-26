export async function getAllDepartment(ctx, next) {
    const { Department } = ctx.orm();

    let departmentList = await Department.findAll({
        attributes: [['id', 'value'], ['department_name', 'label']]
    });

    return departmentList;
}