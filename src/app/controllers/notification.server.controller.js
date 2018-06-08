import Sequelize from 'sequelize';
import uuidV4 from 'uuid/v4';

const Op = Sequelize.Op

export async function initNotification(ctx, next) {
    const { NOTICE, USER, USER_NOTICE } = ctx.orm();
    const { currentPage, pageSize, notice_title, create_user, status, startTime, endTime } = ctx.query;

    const query = [{
        type: 'text',
        label: '标题',
        name: 'notice_title',
        placeholder: '请输入标题名称'
    }, {
        type: 'text',
        label: '发布者',
        name: 'create_user',
        placeholder: '请输入发布者名称'
    }, {
        type: 'select',
        label: '状态',
        name: 'status',
        placeholder: '请选择状态',
        options: [{
            value: '0',
            label: '全部'
        }, {
            value: '1',
            label: '全部已读'
        }, {
            value: '2',
            label: '全部未读'
        }, {
            value: '3',
            label: '部分已读'
        }]
    }, {
		type: 'date',
		label: '日期',
		name: 'startTime',
		placeholder: '开始日期'
	}, {
		type: 'date',
		label: '日期',
		name: 'endTime',
		placeholder: '结束日期'
    }];
    
    const columns = [{
        label: '标题',
		align: 'center',
        prop: 'notice_title'
    }, {
        label: '发布者',
		align: 'center',
        prop: 'create_user'
    }, {
        label: '已读人数',
		align: 'center',
        prop: 'hadRead'
    }, {
        label: '未读人数',
		align: 'center',
        prop: 'noRead'
    }, {
        label: '总人数',
		align: 'center',
        prop: 'total'
    }, {
        label: '创建时间',
		align: 'center',
        prop: 'createtime',
        width: '200'
    }, {
        label: '操作',
		align: 'center',
        prop: 'operate',
        width: '260'
    }];

    let create_id = null;
    if (create_user) {
        const user = await USER.findAll({
            where: {
                username: create_user
            }
        });

        if (user && user.length) {
            create_id = user[0].id;
        } else {
            create_id = -1;
        }
    }

    let whereStat = {};

	if (notice_title) {
		whereStat.notice_title = notice_title;
	}

	if (create_id) {
		whereStat.create_id = create_id;
	}

	if (startTime) {
		whereStat.time_stamp = {
			[Op.gte]: startTime
		}
	}

	if (endTime) {
		whereStat.time_stamp = Object.assign(whereStat.time_stamp, {[Op.lte]: endTime});
    }
    
    const notices = await NOTICE.findAll({
        where: {
            ...whereStat
        }
    });

    const noticesIds = [];
    const userIds = [];
    notices.forEach((item) => {
        noticesIds.push(item.id);
        userIds.push(item.create_id);
    });

    // 总人数
    const user_notices = await USER_NOTICE.findAll({
        attributes: [
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'totals'],
            'NOTICEId'
        ],
        group:'NOTICEId',
        where: {
            NOTICEId: {
                [Op.in]: noticesIds
            }
        }
    });

    // 未读人数
    const no_user_notices = await USER_NOTICE.findAll({
        attributes: [
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'totals'],
            'NOTICEId'
        ],
        group:'NOTICEId',
        where: {
            status: '0',
            NOTICEId: {
                [Op.in]: noticesIds
            }
        }
    });

    // 创建者
    const users = await USER.findAll({
        where: {
            id: {
                [Op.in]: userIds
            }
        }
    });

    const datas = [];
    notices.forEach((notice) => {
        let obj = {};

        obj.id = notice.id;
        obj.notice_title = notice.notice_title;
        obj.createtime = parseInt(notice.time_stamp);

        //  创建者
        users.forEach((item) => {
            if (item.id === notice.create_id) {
                obj.create_user = item.username;
            }
        });

        // 总人数
        user_notices.forEach((item) => {
            if (item.dataValues.NOTICEId === notice.id) {
                obj.total = item.dataValues.totals ? item.dataValues.totals : 0;
            }
        });

        // 未读人数
        no_user_notices.forEach((item) => {
            if (item.dataValues.NOTICEId === notice.id) {
                obj.noRead = item.dataValues.totals ? item.dataValues.totals : 0;
            }
        });

        // 已读人数
        obj.hadRead = obj.total - obj.noRead;

        if (!status || status === '0') {
            datas.push(obj);
        } else if (status === '1' && obj.hadRead === obj.total) {
            datas.push(obj);
        } else if (status === '2' && obj.noRead === obj.total) {
            datas.push(obj);
        } else if(status === '3' && obj.hadRead !== obj.total && obj.noRead !== obj.total){
            datas.push(obj);
        }
       
    });

    ctx.body = {
        data: {
            query,
            columns,
            datas,
            create_id
        },
        returnCode: '1001',
        message: 'success'
    }
}

// 新增通知
export async function addNotice(ctx) {
    const { NOTICE, USER, USER_NOTICE } = ctx.orm();
    const { users, title, content } = ctx.request.body;
    const userId = ctx.session.userinfo.id;

    let noticeId = uuidV4();
    let notice = {
        id: noticeId,
        create_id: userId,
        notice_title: title,
        notice_content: content,
        time_stamp: Date.now() + ''
    };

    let flag = await NOTICE.create(notice);

    users.forEach((user) => {
        flag =  USER_NOTICE.create({
            id: uuidV4(),
            status: 0,
            time_stamp: Date.now() + '',
            USERId: user,
            NOTICEId: noticeId
        });
    });

    ctx.body = {
        data: {
            flag
        },
        returnCode: '1001',
        message: 'success'
    }
}

// 通过id获取notice
export async function getNoticeById(ctx) {
    const { NOTICE } = ctx.orm();
    const id = ctx.query.id;

    const notice = await NOTICE.find({
        where: {
            id: id
        }
    });

    ctx.body = {
        data: {
            notice
        },
        returnCode: '1001',
        message: 'success'
    }
}

// 通过id获取阅读情况
export async function getNoticeAndUserById(ctx) {
    const { USER_NOTICE, USER, DEPARTMENT } = ctx.orm();
    const noticeId = ctx.query.id;

    const user_notices = await USER_NOTICE.findAll({
        where: {
            NOTICEId: noticeId
        }
    });

    let userIds = [];
    let hadReadUsers = [];
    let noReadUsers = [];

    user_notices.forEach((item) => {
        userIds.push(item.USERId);
        if (item.status === 0) {
            noReadUsers.push(item.USERId);
        } else if (item.status === 1) {
            hadReadUsers.push(item.USERId);
        }
    });

    const users = await USER.findAll({
        where: {
            id: {
                [Op.in]: userIds
            }
        }
    });

    let departmentIds = new Set();
    users.forEach((item) => {
        departmentIds.add(item.DEPARTMENTId);
    });

    departmentIds = Array.from(departmentIds);

    const departments = await DEPARTMENT.findAll({
        where: {
            id: {
                [Op.in]: departmentIds
            }
        }
    });

    let hadRead = [];
    let noRead = [];
    
    departments.forEach((department) => {
        let hadReadItem = {
            id: department.id,
			label: department.department_name,
			children: []
        }

        let noReadItem = {
            id: department.id,
			label: department.department_name,
			children: []
        }

        // 未读人员
        users.forEach((user) => {
            if (user.DEPARTMENTId === department.id) {
                if (noReadUsers.indexOf(user.id) > -1 ) {
                    noReadItem.children.push({
                        id: user.id,
                        label: user.username
                    });
                }
    
                if (hadReadUsers.indexOf(user.id) > -1 ) {
                    hadReadItem.children.push({
                        id: user.id,
                        label: user.username
                    });
                }
            }
        });

        hadRead.push(hadReadItem);
        noRead.push(noReadItem);
    });

    ctx.body = {
        data: {
            hadRead,
            noRead
        },
        returnCode: '1001',
        message: 'success'
    }
}

// 获取未读的内容
export async function getNoReadNotice(ctx) {
    const { USER_NOTICE, NOTICE, USER } = ctx.orm();
    const id = ctx.session.userinfo.id;

    const user_notices = await NOTICE.findAll({
        include: [{
            model: USER,
            where: {
                id: id
            }
        }]
    });

    let notices = [];
    user_notices.forEach((item) => {
        if (item.USERs && item.USERs.length && item.USERs[0].USER_NOTICE && item.USERs[0].USER_NOTICE.status === 0) {
            let notice = {
                id: item.id,
                title: item.notice_title
            };

            notices.push(notice);
        }
       
    })

    ctx.body = {
        data: {
            notices
        },
        returnCode: '1001',
        message: 'success'
    }
}

export async function updateNoticeStatus(ctx) {
    const { USER_NOTICE } = ctx.orm();
    const NOTICEId = ctx.query.NOTICEId;
    const userid = ctx.session.userinfo.id;

    const flag = await USER_NOTICE.update({
        status: 1
    }, {
        where: {
            NOTICEId: NOTICEId,
            USERId: userid
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
