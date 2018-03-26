import Sequelize from 'koa-orm/node_modules/sequelize';

import { getAllLevel } from './level.server.controller';
import { getAllDepartment } from './department.server.controller';

const Op = Sequelize.Op

// 登录
export async function login(ctx) {
	const { User } = ctx.orm();
	const { username, password } = ctx.request.body;

	if (!username) {
		ctx.body = { 
			data: {

			},
			returnCode: '4000',
			message: 'username is required'
		};
		return;
	}

	if (!password) {
		ctx.body = { 
			data: {
				
			},
			returnCode: '4000',
			message: 'password is required'
		};
		return;
	}

	const userInfo = await User.find({
		where: {
			username: username,
			password: password
		}
	});

	if (!userInfo) {
		ctx.body = { 
			data: {
				
			},
			returnCode: '4003',
			message: 'password is invalid'
		};
		return;
	}

	ctx.session.authenticated = true;
	ctx.session.user = userInfo;

	ctx.body = { 
		data: {
			user: userInfo
		},
		returnCode: '1001',
		message: 'success' 
	};
}

// 获取登录信息
export async function info(ctx) {
	let user = ctx.session.user;
	let authenticated = ctx.session.authenticated;

	if (authenticated) {
		ctx.body = {
			data: {
				user,
				authenticated
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
	const user_id = ctx.session.user.id;
	const { User, Department, Level } = ctx.orm();

	const users = await User.findAll({
		where: {
			id: {
				[Op.ne]: user_id
			}
		},
		include: [
            {
                model: Department
            }, {
				model: Level
			}
        ]
	});

	const levelList = await getAllLevel(ctx, next);
	const departmentList = await getAllDepartment(ctx, next);

	const columns = [{
		label: 'id',
		align: 'center',
        prop: 'id'
	}, {
		label: '用户名',
		align: 'center',
        prop: 'username'
	}, {
		label: '密码',
		align: 'center',
        prop: 'password'
	},{
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
        prop: 'createtime'
	}, {
		label: '操作',
		align: 'center',
		prop: 'operate'
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
			department: user.Department.department_name,
			level: user.Level.level_name,
			createtime: user.createdAt,
			password: user.password,
			operate: ['查看', '编辑', '修改密码']
		});
	});

	ctx.body = {
		data: {
			columns,
			datas,
			query,
			levelList,
			departmentList
		},
		returnCode: '1001',
		message: 'success' 
	}
}

export async function addUser(ctx, next) {
	const { User } = ctx.orm();
	const data = ctx.request.body;

	let flag = await User.create(data);

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
