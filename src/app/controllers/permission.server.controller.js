import Sequelize from 'koa-orm/node_modules/sequelize';

const Op = Sequelize.Op

// 获取用户的权限
export async function getPermission(ctx, next) {
    const user_id = ctx.session.user.id;
    const { Permission, User } = ctx.orm();

    // 通过user_id 获取权限
    const permissions = await Permission.findAll({
        order: [
            ['id']
        ],
        include: [
            {
                model: User,
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
    const parentPermissions = await Permission.findAll({
        order: [
            ['id']
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
    const user_id = ctx.session.user.id;
    const { Permission, User } = ctx.orm();

    // 通过user_id 获取权限
    const permissions = await Permission.findAll({
        order: [
            ['id']
        ],
        include: [
            {
                model: User,
                where: {
                    id: user_id
                }
            }
        ]
    });

    let bigImgPermissions = [];

    permissions.forEach((permission) => {
        let users = permission.Users;

        users.forEach((user) => {
            if (user.User_Permission.status === 1) {
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

export async function deleteBigPermission(ctx) {
    const user_id = ctx.session.user.id;
    const permission_id = ctx.request.query.permissionId;
    const { User_Permission } = ctx.orm();

    const flag = await User_Permission.update({status: 0},{
        where: {
            UserId: user_id,
            PermissionId: permission_id
        }
    });

    ctx.body = {
        data: flag,
        returnCode: '1001',
        message: 'success' 
    }
}

export async function addBigPermission(ctx) {
    const user_id = ctx.session.user.id;
    const bigPermissions = ctx.request.query['bigPermissions[]'] || [];
    const { User_Permission } = ctx.orm();

    let flag = await User_Permission.update({status: 0},{
        where: {
            UserId: user_id
        }
    });

    flag = await User_Permission.update({status: 1},{
        where: {
            UserId: user_id,
            PermissionId:{
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
