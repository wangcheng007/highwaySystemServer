import { getPermissionByParentId } from './permission.server.controller';

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

// // 获取人员的权限
// export async function getPermissionByUserId(ctx) {
// 	const { User, Permission } = ctx.orm();
// 	const userId = ctx.session.user.id;

// 	const user_permission = await User.findById(userId, {
// 		order: [
// 			[Permission, 'permission_order']
// 		],
// 		include: [
// 			{
// 				model: Permission
// 			}
// 		]
// 	});

// 	const permissions = [];
// 	const parrntIds = [];

// 	console.log(user_permission.getPermissions());
// 	// user_permission && user_permission.Permission.map((permission) => {

// 	// });


// 	ctx.body = {
// 		data: {
// 			user_permission: user_permission
// 		},
// 		returnCode: '1001',
// 		message: 'success' 
// 	}
// }