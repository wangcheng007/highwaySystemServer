import Sequelize from 'koa-orm/node_modules/sequelize';

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
export async function getUsers(ctx) {
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

	const columns = [{
		label: 'id',
        prop: 'id'
	}, {
		label: '用户名',
        prop: 'username'
	}, {
		label: '部门',
        prop: 'department',
	}, {
		label: '职位',
        prop: 'level',
	}, {
		label: '创建时间',
        prop: 'createtime'
	}];

	let datas = [];
	users.forEach((user) => {
		datas.push({
			id: user.id,
			username: user.username,
			department: user.Department.department_name,
			level: user.Level.level_name,
			createtime: user.createdAt
		});
	});

	ctx.body = {
		data: {
			columns,
			datas
		},
		returnCode: '1001',
		message: 'success' 
	}
}