import Sequelize from 'koa-orm/node_modules/sequelize';
import uuidV4 from 'uuid/v4';
import { getAllLevel } from './level.server.controller';
import { getAllDepartment } from './department.server.controller';
import crypto from 'crypto';

const Op = Sequelize.Op

function password2md5(password) {
	const md5 = crypto.createHash('md5');
	return md5.update(password).digest('hex');
}

// 登录
export async function login(ctx) {
	const { USER } = ctx.orm();
	let { username, password } = ctx.request.body;

	password = password2md5(password);

	if (!username) {
		ctx.body = { 
			data: {},
			returnCode: '4000',
			message: '用户名不能为空'
		};
		return;
	}

	if (!password) {
		ctx.body = { 
			data: {},
			returnCode: '4000',
			message: '密码不能为空'
		};
		return;
	}

	const user = await USER.find({
		where: {
			username: username,
			password: password
		}
	});

	if (!user) {
		ctx.body = { 
			data: {},
			returnCode: '4003',
			message: '密码错误'
		};
		return;
	}

	let userinfo = {
		username: user.username,
		img: user.img,
		id: user.id
	}

	ctx.session.authenticated = true;
	ctx.session.userinfo = userinfo;

	ctx.body = { 
		data: {
			userinfo: userinfo
		},
		returnCode: '1001',
		message: 'success' 
	};
}

// 获取登录信息
export async function info(ctx) {
	let userinfo = ctx.session.userinfo;
	let authenticated = ctx.session.authenticated;

	if (authenticated) {
		ctx.body = {
			data: {
				userinfo
			},
			returnCode: '1001',
			message: 'success' 
		}
	} else {
		ctx.body = {
			data: {},
			returnCode: '2002',
			message: 'fail' 
		}
	}
}

// 退出登录
export async function logout(ctx, next) {
	if (ctx.session.authenticated) {
		delete ctx.session.authenticated;
		delete ctx.session.user;

		ctx.body = {
			data: {},
			returnCode: '1001',
			message: 'success' 
		}
	} else {
		ctx.body = {
			data: {},
			returnCode: '2002',
			message: 'faild' 
		}
	}
}

// 获取人员列表
export async function getUsers(ctx, next) {
	const user_id = ctx.session.userinfo.id;
	const { USER, DEPARTMENT, LEVEL } = ctx.orm();
	const { currentPage, pageSize, departmentId, levelId, username, startTime, endTime } = ctx.query;

	let whereStat = {};

	if (username) {
		whereStat.username = username;
	}

	if (departmentId) {
		whereStat.DEPARTMENTId = departmentId;
	}

	if (levelId) {
		whereStat.LEVELId = levelId;
	}

	if (startTime) {
		whereStat.time_stamp = {
			[Op.gte]: startTime
		}
	} 

	if (endTime) {
		whereStat.time_stamp = Object.assign(whereStat.time_stamp, {[Op.lte]: endTime});
	}
	let users = await USER.findAll({
		where: {
			id: {
				[Op.ne]: user_id
			},
			...whereStat
		},
		order: [
            ['time_stamp', 'DESC']
        ],
		offset: parseInt((currentPage - 1) * pageSize),
		limit: parseInt(pageSize),
		include: [
            {
				model: DEPARTMENT,
            }, {
				model: LEVEL,
			}
        ]
	});

	let total = await USER.findAll({
		where: {
			id: {
				[Op.ne]: user_id
			},
			...whereStat
		},
		attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'ids']]
	});

	const pageconfig = {
		currentPage: parseInt(currentPage),
		pageSize: parseInt(pageSize),
		total: total
	};
	const levelList = await getAllLevel(ctx, next);
	const departmentList = await getAllDepartment(ctx, next);

	const columns = [{
		label: '用户名',
		align: 'center',
        prop: 'username'
	}, {
		label: '部门',
		align: 'center',
        prop: 'department'
	}, {
		label: '职位',
		align: 'center',
        prop: 'level'
	}, {
		label: '创建时间',
		align: 'center',
		prop: 'createtime',
		width: '200'
	}, {
		label: '操作',
		align: 'center',
		prop: 'operate',
		width: '240'
	}];

	const query = [{
		type: 'text',
		lable: '姓名',
		name: 'username',
		placeholder: '请输入用户名'
	}, {
		type: 'select',
		label: '职位',
		name: 'level',
		placeholder: '请选择职位',
		options: levelList
	}, {
		type: 'select',
		label: '部门',
		name: 'department',
		placeholder: '请选择部门',
		options: departmentList
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

	let datas = [];
	users.forEach((user) => {
		datas.push({
			id: user.id,
			username: user.username,
			departmentId: user.DEPARTMENT ? user.DEPARTMENT.id : '',
			department: user.DEPARTMENT ? user.DEPARTMENT.department_name : '',
			levelId: user.LEVEL ? user.LEVEL.id : '',
			level: user.LEVEL ? user.LEVEL.level_name : '',
			createtime: parseInt(user.time_stamp),
			operate: ['查看', '编辑', '修改密码']
		});
	});

	ctx.body = {
		data: {
			columns,
			datas,
			query,
			pageconfig,
			levelList,
			departmentList
		},
		returnCode: '1001',
		message: 'success' 
	}
}

// 新增用户
export async function addUser(ctx, next) {
	const { USER } = ctx.orm();
	let data = ctx.request.body;

	data.id = uuidV4();
	data.time_stamp = Date.now() + '';
	data.DEPARTMENTId = data.department;
	data.LEVELId = data.level;
	data.password = password2md5(data.password);

	let users = await USER.findAll({
		where: {
			username: data.username
		}
	});

	let use = users;

	if (users && users.length) {
		ctx.body = {
			data: {},
			returnCode: '400',
			message: '该用户名已存在' 
		}

		return;
	}

	let flag = await USER.create(data);
	if (flag) {
		ctx.body = {
			data: {
				flag: flag
			},
			returnCode: '1001',
			message: 'success' 
		}
	} else {
		ctx.body = {
			data: {},
			returnCode: '2002',
			message: 'fail' 
		}
	}
}

// 删除用户
export async function deleteUser(ctx, next) {
	const { USER } = ctx.orm();
	const userId = ctx.request.body.userId

	let flag = await USER.destroy({
		where: {
			id: userId
		}
	});


	if (flag) {
		ctx.body = {
			data: {
				flag
			},
			returnCode: '1001',
			message: 'success' 
		}
	} else {
		ctx.body = {
			data: {},
			returnCode: '4000',
			message: 'fail' 
		}
	}
}


// 修改密码
export async function updatePassword(ctx, next) {
	const { USER } = ctx.orm();
	const data = ctx.request.body;

	const flag = await USER.update({
		password: password2md5(data.password)
	}, {
		where: {
			id: data.userId
		}
	});

	if (flag) {
		ctx.body = {
			data: {},
			returnCode: '1001',
			message: 'success' 
		}
	} else {
		ctx.body = {
			data: {},
			returnCode: '4000',
			message: '操作失败' 
		}
	}
}

// 修改人员信息
export async function editUser(ctx, next) {
	const { USER } = ctx.orm();
	const data = ctx.request.body;

	const flag = await USER.update({
		DEPARTMENTId: data.department,
		LEVELId: data.level
	}, {
		where: {
			id: data.userId
		}
	});

	if (flag) {
		ctx.body = {
			data: {},
			returnCode: '1001',
			message: 'success' 
		}
	} else {
		ctx.body = {
			data: {},
			returnCode: '4000',
			message: '操作失败' 
		}
	}

}
