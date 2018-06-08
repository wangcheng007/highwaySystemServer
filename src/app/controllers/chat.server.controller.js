import Sequelize from 'sequelize';
const Op = Sequelize.Op;
import uuidV4 from 'uuid/v4';

export async function getRecentConcats(ctx) {
    const { CHAT, USER } = ctx.orm();
    const user_id = ctx.session.userinfo.id;

    let allUsers = await USER.findAll({
        where: {
            id: {
                [Op.ne]: user_id
            }
        }
    });

    let recentConcatUsers  = [];

    for(let i = 0; i < allUsers.length; i++) {
        let user = allUsers[i];

        let isChat = await CHAT.find({
            where: {
                [Op.or]: [{sender_id: user_id, recipient_id: allUsers[i].id }, {sender_id: allUsers[i].id, recipient_id: user_id}]
            },
            order:[
                ['last_update', 'DESC']
            ]
        });

        if (isChat) {
            recentConcatUsers.push({
                id: user.id,
                username: user.username,
                img: user.img,
                last_update: isChat.last_update
            });
        }
    }

    let recentConcats = recentConcatUsers.sort((a, b) => {
        return parseInt(b.last_update) - parseInt(a.last_update);
    });

    let recentConcatUserIds = [];
    recentConcats.forEach((item) => {
        recentConcatUserIds.push(item.id);
    });

    let noReadMessages = await CHAT.findAll({
        attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'ids'], 'sender_id'],
        where: {
            sender_id: {
                [Op.in]: recentConcatUserIds
            },
            recipient_id: user_id,
            status: 0
        },
        group: 'sender_id'
    });

    for(let i = 0; i < recentConcats.length; i++) {
        for(let j = 0; j < noReadMessages.length; j++) {
            if (recentConcats[i].id === noReadMessages[j].sender_id) {
                recentConcats[i].noReadMessageCount = noReadMessages[j].dataValues.ids;
            }
        }
    }

    ctx.body = {
        data: {
            recentConcats
        },
        returnCode: '1001',
        message: 'success'
    }
}

export async function getRecentMessage(ctx) {
    const { USER, CHAT, LEVEL } = ctx.orm();
    const currentId = ctx.request.query.currentConcatId;
    const user_id = ctx.session.userinfo.id;

    let currentUser = await USER.find({
        where: {
            id: currentId
        },
        include: [
            {
				model: LEVEL
            }
        ]
    });
    
    let recentMessages = await CHAT.findAll({
        where: {
            [Op.or]: [{sender_id: user_id, recipient_id: currentId }, {sender_id: currentId, recipient_id: user_id}]
        },
        order: [
            ['last_update', 'DESC']
        ],
        offset: 0,
		limit: 10
    });

    ctx.body = {
        data: {
            currentUser,
            recentMessages: recentMessages.reverse()
        },
        returnCode: '1001',
        message: 'success'
    }
}

export async function newMessage(ctx) {
    const { CHAT } = ctx.orm();
    const { sender_id, recipient_id, message } = ctx.request.query;

    let flag = await CHAT.create({
        id: uuidV4(),
        sender_id: ctx.session.userinfo.id,
        recipient_id: recipient_id,
        message: message,
        status: 0,
        last_update: Date.now() + ''
    });

    ctx.body = {
        data: {
            flag
        },
        returnCode: '1001',
        message: 'success'
    }
}

export async function readUnreadMessage(ctx) {
    const { CHAT } = ctx.orm();
    const user_id = ctx.session.userinfo.id;
    const currentConcatId = ctx.request.query.currentConcatId;

    let flag = await CHAT.update({
        status: 1
    }, {
        where: {
            sender_id: currentConcatId,
            recipient_id: user_id,
            status: 0
        }
    });

    ctx.body = {
        data: {
            flag
        },
        returnCode: '1001',
        message: 'success'
    }
}
