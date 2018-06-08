import { getAllCaseTypes } from './casetype.server.controller';
import uuidV4 from 'uuid/v4';
import Sequelize from 'sequelize';

const Op = Sequelize.Op;

// 初始化
export async function initCase(ctx) {
    const { CASE, USER, CASETYPE } = ctx.orm();
    const { currentPage, pageSize, title, casetype, startTime, endTime, status } = ctx.query;
	const userinfo = ctx.session.userinfo;

	const casetypes = await getAllCaseTypes(ctx);
    const query = [{
		type: 'text',
		lable: '名称',
		name: 'title',
		placeholder: '请输入标题'
    }, {
		type: 'select',
        label: '状态',
        name: 'status',
        placeholder: '请选择状态',
        options: [{
			label: '待审核',
			value: 0
		},{
			label: '待归档',
			value: 1
		},{
			label: '已退回',
			value: 2
		},{
			label: '已归档',
			value: 3
		}]
	},{
		type: 'select',
        label: '案件类型',
        name: 'casetype',
        placeholder: '请选择案件类型',
        options: casetypes
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
		label: '创建者',
		align: 'center',
        prop: 'create'
	}, {
		label: '标题',
		align: 'center',
        prop: 'title'
	}, {
		label: '案件类型',
		align: 'center',
        prop: 'casetype'
	}, {
		label: '状态',
		align: 'center',
        prop: 'status'
	}, {
		label: '审核人',
		align: 'center',
        prop: 'agent'
	}, {
		label: '创建时间',
		align: 'center',
		prop: 'createtime',
		width: '200'
	}, {
		label: '操作',
		align: 'center',
		prop: 'operate',
		width: '200'
	}];

	let datas = [];

	let userStamp = {};
    if(userinfo.level === '2') {
        userStamp.DEPARTMENTId = userinfo.department
    } else if (userinfo.level === '3') {
        userStamp.id = userinfo.id
	}
	
	let whereStat = {};

	if (status) {
		whereStat.case_status = status;
	}

	if (startTime) {
		whereStat.car_time = {
			[Op.gte]: startTime
		}
	} 

	if (endTime) {
		whereStat.car_time = Object.assign(whereStat.car_time, {[Op.lte]: endTime});
	}

	let typeStat = {};
	
	if(casetype) {
		typeStat.id = casetype;
	}

	let cases = await CASE.findAll({
		where: {
			...whereStat
		},
		include:[{
			model: USER,
			where: {
				...userStamp
			}
		}, {
			model: CASETYPE,
			where: {
				...typeStat
			}
		}]
	});

	cases.forEach((item) => {
		datas.push({
			id: item.id,
			create: item.USER.username,
			title: item.case_title,
			casetype: item.CASETYPE.case_type_name,
			status: item.case_status,
			agent: item.agent_id,
			createtime: item.time_stamp
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

export async function addCase(ctx) {
	const { CASE } = ctx.orm();
	const query = ctx.request.query;

	let caseId = uuidV4();
	let caseData = {
		id: caseId,
		case_status: 0,
		USERId: ctx.session.userinfo.id,
		...query
	}

	let flag = await CASE.create(caseData);

	ctx.body = {
		data: {
			caseId
		},
		returnCode: '1001',
		message: 'success'
	}
}

export async function updateCase(ctx) {
    const { CASE } = ctx.orm();
    const { status, id } = ctx.request.query;
    const agent_name = ctx.session.userinfo.username;

    let flag = null;
    if (status !== '3') {
        flag = await CASE.update({
            case_status: status,
            agent_id: agent_name
        }, {
            where: {
                id: id
            }
        });
    } else {
        flag = await CASE.update({
            case_status: status
        }, {
            where: {
                id: id
            }
        });
    }

    ctx.body = {
        data: {
            flag
        },
        returnCode: '1001',
        message: 'success'
    }

}

export async function getCaseDetailById(ctx) {
	const { CASE, CASETYPE, CAR } = ctx.orm();
	const id = ctx.request.query.id;

	let detailCase = await CASE.find({
		where: {
			id: id
		},
		include: [{
			model: CASETYPE
		}, {
			model: CAR
		}]
	});

	ctx.body = {
		data: {
			detailCase
		},
		returnCode: '1001',
		message: 'success'
	}
}

export async function initTotalCase(ctx) {
	const { CASE, CAR, CASETYPE } = ctx.orm();
	const { startTime, endTime } = ctx.request.query;

	const query = [{
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

	let whereStat = {};

	if (startTime) {
		whereStat.car_time = {
			[Op.gte]: startTime
		}
	} 

	if (endTime) {
		whereStat.car_time = Object.assign(whereStat.car_time, {[Op.lte]: endTime});
	}

	let cases = await CASE.findAll({
		where: {
			...whereStat
		},
		include: [{
			model: CAR
		}, {
			model: CASETYPE
		}]
	});

	ctx.body = {
		data: {
			query,
			cases
		},
		returnCode: '1001',
		message: 'success'
	}
}