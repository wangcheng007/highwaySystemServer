import * as teacher from '../controllers/teacher.server.controller';

export default function(router) {
	router.get('/teacher', teacher.findAll);

	return router;
}