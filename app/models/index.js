// 整合表关系
function initTables(sequelize, DataTypes) {
    const User = sequelize.import('./user.server.model.js');
    const Level = sequelize.import('./level.server.model.js');
    const Permission = sequelize.import('./permission.server.model.js');
    const User_Permission = sequelize.import('./user_permission.server.model.js');
    const Department = sequelize.import('./department.server.model.js');
    const Todo = sequelize.import('./todo.server.model.js');
    const Case = sequelize.import('./case.server.model.js');
    const CaseType = sequelize.import('./casetype.server.model.js');
    const Car = sequelize.import('./car.server.model.js');
    const CarType = sequelize.import('./cartype.server.model.js');
    const Notic = sequelize.import('./notice.server.model.js');

    // 用户和权限是多对多的关系
    User.belongsToMany(Permission, {through: User_Permission});
    Permission.belongsToMany(User, {through: User_Permission});

    // 用户和部门是多对一的关系
    Department.hasMany(User);
    User.belongsTo(Department);

    // 用户和职位是多对一的关系
    Level.hasMany(User);
    User.belongsTo(Level);

    // 用户和待办事项为一对多
    User.hasMany(Todo);
    Todo.belongsTo(User);

    // 待办事项和案件为一对一的关系
    Todo.hasOne(Case);
    Case.belongsTo(Todo);

    // 案件和案件类型为多对一的关系
    CaseType.hasMany(Case);
    Case.belongsTo(CaseType);

    // 车辆信息和车辆品牌是多对一的关系
    CarType.hasMany(Car);
    Car.belongsTo(CarType);

    // 用户和通知为多对多的关系
    const user_notice = sequelize.define('user_notice',{
        status: {
            type: DataTypes.INTEGER,
            comment: '是否已读, 0: 未读, 1: 已读'
        }
    });
    User.belongsToMany(Notic, {through: user_notice});
    Notic.belongsToMany(User, {through: user_notice});

    return User;
}

export default initTables;