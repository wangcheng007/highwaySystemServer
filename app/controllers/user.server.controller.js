export async function findAll(ctx) {
	const {
		User
	} = ctx.orm();

	const users = await User.findAll({});

	ctx.body = {
		users
	};
}

export async function login(ctx) {
	const { User } = ctx.orm();
	const { username, password } = ctx.request.body;

	ctx.assert(username, 400, 'username is required');
	ctx.assert(password, 400, 'password is required');
	  
	const user = await User.auth(username, password);

	ctx.assert(user, 403, 'password is invalid');
	ctx.session.authenticated = true;
	ctx.session.user = user;
	ctx.body = { username };
}