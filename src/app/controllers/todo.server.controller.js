import Sequelize from 'sequelize';
import uuidV4 from 'uuid/v4';

const Op = Sequelize.Op;

export async function addTodo(ctx) {
    const { TODO, USER } = ctx.orm();
    const query = ctx.request.query;

    const users = await USER.findAll({
        where: {
            [Op.or]: [{
                DEPARTMENTId: query.department,
                LEVELId: {
                    [Op.ne]: 3
                }
            }, {
                LEVELId: 1
            }]
        }
    });

    for(let i = 0; i < users.length; i++) {
        const id = users[i].id;

        let flag = await TODO.create({
            id: uuidV4(),
            type: query.type,
            associatedID: query.id,
            status: 0,
            time_stamp: Date.now() + '',
            USERId: id
        });
    }

    ctx.body = {
        data: {query},
        returnCode: '1001',
        message: 'success'
    }
}

export async function getNoReadTodo(ctx) {
    const { TODO, CAR, CASE } = ctx.orm();
    const user_id = ctx.session.userinfo.id;

    const noReadTodos = await TODO.findAll({
        where: {
            USERId: user_id,
            status: 0
        },
        order:[
            ['time_stamp', 'DESC']
        ]
    })

    let todos = [];

    for(let i = 0; i < noReadTodos.length; i++) {
        let item ;
        if (noReadTodos[i].type === 0) {
            item = await CAR.find({
                where: {
                    id: noReadTodos[i].associatedID
                }
            })
        } else if (noReadTodos[i].type === 1) {
            item = await CASE.find({
                where: {
                    id: noReadTodos[i].associatedID
                }
            })
        }
        
        todos.push(item);
    }

    ctx.body = {
        data: {
            todos
        },
        returnCode: '1001',
        message: 'success'
    }
}

export async function updateTodo(ctx) {
    const { TODO } = ctx.orm();
    const type = ctx.request.query.type;
    const user_id = ctx.session.userinfo.id;

    let flag = await TODO.update({
        status: 1
    }, {
        where: {
            type: type,
            USERId: user_id
        }
    })

    ctx.body = {
        data: {
            flag
        },
        returnCode: '1001',
        message: 'success'
    }
}
