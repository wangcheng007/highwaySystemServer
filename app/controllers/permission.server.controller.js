import Sequelize from 'koa-orm/node_modules/sequelize';

const Op = Sequelize.Op
// 根据parentid 获取权限信息
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