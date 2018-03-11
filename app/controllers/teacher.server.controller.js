export async function findAll(ctx) {
	const {
		Teacher
	} = ctx.orm();

	const teachers = await Teacher.findAll();

	ctx.body = {
		teachers
	};
}