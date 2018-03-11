export async function findAll(ctx) {
	const {
		User
	} = ctx.orm();

	const users = async function() {
		const users = await User.findAll({});

		return users;
	}

	ctx.body = {
		users
	};
}