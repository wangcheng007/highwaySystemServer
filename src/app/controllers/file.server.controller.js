import multer from 'koa-multer';
import uuidV5 from 'uuid/v5';
import uuidV4 from 'uuid/v4';
import fs from 'fs';
import path from 'path';

const MAX_FILE_SIZE =  20 * 1024 * 1024;
const FILE_ID_RANDOM = 'd006d56c-b170-4ef5-8339-e4d2eb7fd70c';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { sign } = req.body;
        const FILEId = uuidV5(`${sign}`, FILE_ID_RANDOM);
        const destPath = path.resolve(__dirname, `../../../tmpdir/${FILEId}`);
        const uploadDir = path.resolve(__dirname, `../../../tmpdir`);

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath);
        }

        cb(null, destPath)
    },
    filename: (req, file, cb) => {
        const { chunk } = req.body;
        cb(null, `${chunk}.part.tmp`);
    }
});

export const upload = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE
    }
}).single('file');

export async function closeUpload(ctx, next) {
    const { FILE } = ctx.orm();

    const { sign, total, chunk } = ctx.req.body;
    const file = ctx.req.file;
    const { originalname } = file;
    const filePath = path.resolve(file.destination, 'final.tmp');

    let dataObj = {
        FILEId: uuidV4()
    }

    try {
        const rs = fs.createReadStream(file.path);
        const ws = fs.createWriteStream(filePath, {
            flags: 'a+'
        });

        // const renameFile = function () {
        //     return new Promise((resolve, reject) => {
        //         if (total - 1 === chunk) { // 最后一个分片写入成功，则修正文件名
        //             const finalPath = path.resolve(file.destination, originalname);
        //             console.log(1);
        //             fs.rename(filePath, finalPath, err => {
        //                 if (err) {
        //                     reject('最后分片修正文件名失败');
        //                 } else {
        //                     resolve();
        //                 }
        //             });
        //         }
        //         resolve();
        //     });
        // }

        rs.pipe(ws)
        .on('finsh', () => {
            rimraf(file.path, err => {
                if (err) {
                    console.log(`删除临时文件失败: ${err.message}`);
                } else {
                    console.log(`删除临时文件成功`);
                }
            });

            if (total - 1 === chunk) {
                const finalPath = path.resolve(file.destination, originalname);
                fs.rename(filePath, finalPath);
            }
            // Promise.all([
            //     // writeInfo(),
            //     renameFile()
            // ]).then(() => {
            //     ctx.body = {
            //         data: {
            //             fileId: dataObj.FILEId
            //         },
            //         returnCode: '1001',
            //         messafe: 'success'
            //     }
            // }).catch(err => {
            //     throw new Error(err);
            // });
        })
        .on('error', err => {
            rs.end();
            ws.end();
            throw new Error('上传文件写入失败');
        });
    } catch (e) {
        console.log(e.message);
    };

    ctx.body = {
        data: {
            fileId: dataObj.FILEId
        },
        returnCode: '1001',
        messafe: 'success'
    }
}