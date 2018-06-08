import Sequelize from 'sequelize';
import uuidV4 from 'uuid/v4';

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
            id: {
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

// 获得所有权限
export async function getAllPermissions(ctx) {
    const { PERMISSION } = ctx.orm();

    const permissions = await PERMISSION.findAll({
        where: {
            parent_id: {
                [Op.ne]: null
            }
        }
    });

    ctx.body = {
        data: {
            permissions
        },
        returnCode: '1001',
        message: 'success'
    }
}

// 获得个人已有权限
export async function getUserHadPermission(ctx) {
    const { USER, PERMISSION, USER_PERMISSION} = ctx.orm();
    const userId = ctx.query.id;

    const user_permissions = await USER_PERMISSION.findAll({
        where: {
            USERId: userId
        } 
    });

    let permissionIds = [];
    user_permissions.forEach((item) => {
        permissionIds.push(item.PERMISSIONId);
    });

    const permissions = await PERMISSION.findAll({
        where: {
            id: {
                [Op.in]: permissionIds
            }
        }
    });


    ctx.body = {
        data: {
            userId,
            permissions
        },
        returnCode: '1001',
        message: 'success'
    }
}

// 分配权限
export async function assignPermissions(ctx) {
    const { USER_PERMISSION } = ctx.orm();
    const { transferValue, userId} =  ctx.request.body;

    let flag = await USER_PERMISSION.destroy({
        where: {
            PERMISSIONId: {
                [Op.notIn]: transferValue
            },
            USERId: userId
        }
    });

    let user_permissions = await USER_PERMISSION.findAll({
        where: {
            USERId: userId
        }
    });

    let arr = [];
    user_permissions.forEach((item) => {
        arr.push(item.PERMISSIONId);
    });

    transferValue.forEach((item) => {
        if (arr.findIndex((id) => item === id) === -1) {
            flag = USER_PERMISSION.create({
                id: uuidV4(),
                status: 0,
                time_stamp: Date.now() + '',
                USERId: userId,
                PERMISSIONId: item
            });
        }
    });

    ctx.body = {
        data: {flag},
        returnCode: '1001',
        message: 'success'
    }
}

export async function getInitPermission(ctx) {
    const { PERMISSION } = ctx.orm();
    const { currentPage, pageSize, permission_name } = ctx.query;

    let whereStat = {};

	if (permission_name) {
		whereStat.permission_name = permission_name;
    }

    const query = [{
        type: 'text',
        lable: '权限名称',
        name: 'permission_name',
        placeholder: '请输入权限名'
    }];

    const columns = [{
        label: '权限名称',
		align: 'center',
        prop: 'permission_name'
    }, {
        label: '展示图',
		align: 'center',
        prop: 'big_img'
    }, {
        label: '时间',
		align: 'center',
        prop: 'time_stamp'
    }, {
        label: '操作',
		align: 'center',
        prop: 'operate'
    }];

    let permissions = await PERMISSION.findAll({
        where: {
            parent_id: {
                [Op.ne]: null
            },
            ...whereStat
        },
        offset: parseInt((currentPage - 1) * pageSize),
		limit: parseInt(pageSize),
        order: [
            ['time_stamp', 'DESC']
        ]
    });

    const datas = [];
    permissions.forEach((item) => {
        datas.push({
            id: item.id,
            permission_name: item.permission_name,
            big_img: item.big_img,
            time_stamp: parseInt(item.time_stamp)
        });
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

// 修改头像
export async function changeImg(ctx) {
    const { PERMISSION } = ctx.orm();
    const { permissionId, imgPath } = ctx.request.query;

    let flag = await PERMISSION.update({
        big_img: imgPath
    }, {
        where: {
            id: permissionId
        }
    });

    ctx.body = {
        data:{ flag },
        returnCode: '1001',
        message: 'success'
    }
}
