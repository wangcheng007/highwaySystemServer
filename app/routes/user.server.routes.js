import * as user from '../controllers/user.server.controller';

export default function(router) {
	router.get('/', user.findAll);

	return router;
}