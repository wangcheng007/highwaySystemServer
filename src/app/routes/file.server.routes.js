import * as file from '../controllers/file.server.controller';

export default function(router) {
	router.post('/file/fileUpload', file.upload, file.closeUpload);

    router.get('/file/download/:id', file.downloadFile);

    return router;
}