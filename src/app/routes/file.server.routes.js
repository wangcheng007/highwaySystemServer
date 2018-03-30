import * as file from '../controllers/file.server.controller';

export default function(router) {
    // 获取所有的职位
	router.post('/file/fileUpload', file.upload, file.closeUpload);

    return router;
}