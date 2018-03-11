export async function findAll(ctx) {
	const {
		Teacher
	} = ctx.orm();

	const teachers = async function() {
		const teachers = await Teacher.findById(1);
		return teachers;
	}

	console.log(teachers());
	ctx.body = {
		teachers
	};
}