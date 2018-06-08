import * as todo from '../controllers/todo.server.controller';

export default function(router) {

    router.get('/todo/addTodo', todo.addTodo);

    router.get('/todo/getNoReadTodo', todo.getNoReadTodo);

    router.get('/todo/updateTodo', todo.updateTodo);

    return router;
}