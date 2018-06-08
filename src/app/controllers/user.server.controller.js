import Sequelize from 'sequelize';
import uuidV4 from 'uuid/v4';
import { getAllLevel } from './level.server.controller';
import { getAllDepartment } from './department.server.controller';
import crypto from 'crypto';

const Op = Sequelize.Op;

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
		department: user.DEPARTMENTId,
		level: user.LEVELId,
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
	const { USER } = ctx.orm();
	let authenticated = ctx.session.authenticated;

	if (authenticated) {
		let user_id = ctx.session.userinfo && ctx.session.userinfo.id;
		let user = await USER.find({
			where: {
				id: user_id
			}
		});
		const userinfo = {
			id: user.id,
			username: user.username,
			img: user.img,
			level: user.LEVELId,
			department: user.DEPARTMENTId
		};

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
			returnCode: '3002',
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
			// id: {
			// 	[Op.ne]: user_id
			// },
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
		width: '300'
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
			createtime: parseInt(user.time_stamp)
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

	if (users && users.length) {
		ctx.body = {
			data: {},
			returnCode: '4000',
			message: '该用户名已存在' 
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

// 修改头像
export async function changeHeaderImg(ctx) {
	const { USER } = ctx.orm();
	const filePath = ctx.request.query.filePath;
	const user_id = ctx.session.userinfo.id;

	// 修改人员信息
	let flag = await USER.update({
		img: filePath
	}, {
		where: {
			id: user_id
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

// 获取人员和部门信息
export async function getDepartmentAndUser(ctx) {
	const { DEPARTMENT, USER, LEVEL } = ctx.orm();
	const userid = ctx.session.userinfo.id;

	const departmentAndUsers = await DEPARTMENT.findAll({
		include: [{
			model: USER,
			where: {
				id: {
					[Op.ne]: userid
				}
			},
			include: [{
				model: LEVEL
			}]
		}]
	});

	let data = [];
	departmentAndUsers.forEach((item) => {
		let obj = {
			id: `${item.id}+FFFFFF`,
			label: item.department_name,
			children: []
		}

		if (item.USERs && item.USERs.length) {
			const users = item.USERs.sort((a, b) => {
				return a.LEVELId - b.LEVELId
			});


			users.forEach((user) => {
				obj.children.push({
					img: user.img,
					id: user.id,
					label: user.username,
					levelName: user.LEVEL.level_name
				});
			});
		}

		data.push(obj);
	});

	ctx.body = {
		data: {
			data
		},
		returnCode: '1001',
		message: 'success'
	}
};