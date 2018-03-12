import * as user from '../controllers/user.server.controller';

export default function(router) {
	router.get('/', user.findAll);

	router.post('/user/login', user.login);
	return router;
}