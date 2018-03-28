import Sequelize from 'koa-orm/node_modules/sequelize';

const Op = Sequelize.Op

// 获取用户的权限
export async function getPermission(ctx, next) {
    const user_id = ctx.session.userinfo.id;
    const { PERMISSION, USER } = ctx.orm();

    // 通过user_id 获取权限
    const permissions = await PERMISSION.findAll({
        order: [
            ['permission_order']
        ],
        include: [
            {
                model: USER,
                where: {
                    id: user_id
                }
            }
        ]
    });

    let parentIds = new Set();
    
    permissions && permissions.map((item) => {
        parentIds.add(item.parent_id);
    });

    // 通过parent_id 获取父权限
    const parentPermissions = await PERMISSION.findAll({
        order: [
            ['permission_order']
        ],
        where:{
            'id': {
                [Op.in]: [...parentIds, 0]
            }
        }
    });

    let data = [];
    for (let i = 0; i < parentPermissions.length; i ++) {
        let parentItem = JSON.parse(JSON.stringify(parentPermissions[i]));
        parentItem.children = [];

        for (let j = 0; j < permissions.length; j++) {
            if (parentItem.id === permissions[j].parent_id) {
                parentItem.children.push(permissions[j]);
            }
        }
        
        data.push(parentItem);
    }

    ctx.body = {
        data: data,
        returnCode: '1001',
        message: 'success' 
    }
}

// 获取展示在首页权限
export async function getBigImgPermission(ctx) {
    const user_id = ctx.session.userinfo.id;
    const { PERMISSION, USER } = ctx.orm();

    // 通过user_id 获取权限
    const permissions = await PERMISSION.findAll({
        order: [
            ['permission_order']
        ],
        include: [
            {
                model: USER,
                where: {
                    id: user_id
                }
            }
        ]
    });

    let bigImgPermissions = [];

    permissions.forEach((permission) => {
        let users = permission.USERs;

        users.forEach((user) => {
            if (user.USER_PERMISSION.status === 1) {
                bigImgPermissions.push(permission);
            }
        });
    });

    ctx.body = {
        data: bigImgPermissions,
        returnCode: '1001',
        message: 'success' 
    }
}

// 删除在首页展示权限
export async function deleteBigPermission(ctx) {
    const user_id = ctx.session.userinfo.id;
    const permission_id = ctx.request.query.permissionId;
    const { USER_PERMISSION } = ctx.orm();

    const flag = await USER_PERMISSION.update({status: 0},{
        where: {
            USERId: user_id,
            PERMISSIONId: permission_id
        }
    });

    ctx.body = {
        data: flag,
        returnCode: '1001',
        message: 'success' 
    }
}

// 新增在首页展示权限
export async function addBigPermission(ctx) {
    const user_id = ctx.session.userinfo.id;
    const bigPermissions = ctx.request.query['bigPermissions[]'] || [];
    const { USER_PERMISSION } = ctx.orm();

    let flag = await USER_PERMISSION.update({status: 0},{
        where: {
            USERId: user_id
        }
    });

    flag = await USER_PERMISSION.update({status: 1},{
        where: {
            USERId: user_id,
            PERMISSIONId:{
                [Op.in]: [...bigPermissions]
            } 
        }
    });

    ctx.body = {
        data: flag,
        returnCode: '1001',
        message: 'success' 
    }
}
