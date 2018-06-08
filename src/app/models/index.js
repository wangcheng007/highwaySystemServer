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
    const Notice = sequelize.import('./notice.server.model.js');
    const File = sequelize.import('./file.server.model.js');
    const User_Notice = sequelize.import('./user_notice.server.model.js');
    const Chat = sequelize.import('./chat.server.model.js');
    const Car_Cartype = sequelize.import('./car_cartype.server.model.js');
    const Driver = sequelize.import('./driver.server.model.js');

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

    // // 待办事项和案件为一对一的关系
    // Case.hasOne(Todo);
    // Todo.belongsTo(Case);

    // 案件和案件类型为多对一的关系
    CaseType.hasMany(Case);
    Case.belongsTo(CaseType);

    // 用户和案件为一对多的关系
    User.hasMany(Case);
    Case.belongsTo(User);

    // 用户和案件为一对多的关系
    User.hasMany(Car);
    Car.belongsTo(User);

    // 车辆信息和车辆品牌是多对多的关系
    CarType.belongsToMany(Car, {through: Car_Cartype});
    Car.belongsToMany(CarType, {through: Car_Cartype});

    // 车辆信息和事故为一对多的关系
    Car.hasMany(Case);
    Case.belongsTo(Car);

    Driver.hasMany(Car);
    Car.belongsTo(Driver);

    // 用户和通知为多对多的关系
    User.belongsToMany(Notice, {through: User_Notice});
    Notice.belongsToMany(User, {through: User_Notice});

    return User;
}

export default initTables;