import multer from 'koa-multer';
import uuidV5 from 'uuid/v5';
import uuidV4 from 'uuid/v4';
import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';

const MAX_FILE_SIZE =  20 * 1024 * 1024;
const FILE_ID_RANDOM = 'd006d56c-b170-4ef5-8339-e4d2eb7fd70c';

const fileType = (type) => {
    const typeList = {
        'image/jpeg': 'jpg'
    }

    return typeList[type]
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { sign } = req.body;
        const FILEId = uuidV5(`${sign}`, FILE_ID_RANDOM);
        const destPath = path.resolve(__dirname, `../../../tmpdir/${FILEId}`);
        const tmpdir = path.resolve(__dirname, `../../../tmpdir`);
        const uploaddir = path.resolve(__dirname, `../../../uploads`);
         
        if (!fs.existsSync(uploaddir)) {
            fs.mkdirSync(uploaddir);
        }

        if (!fs.existsSync(tmpdir)) {
            fs.mkdirSync(tmpdir);
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

    let { sign, total, chunk, type } = ctx.req.body;

    total = parseInt(total);
    chunk = parseInt(chunk);

    const file = ctx.req.file;
    const { originalname } = file;
    // 总的文件流
    const filePath = path.resolve(file.destination, 'final.tmp');
    // 唯一标志符号
    const FILEId = uuidV5(`${sign}`, FILE_ID_RANDOM);
    // 最后存入的路径
    const uploadFilePath = path.resolve(__dirname, `../../../uploads/${FILEId}.tmp`);

    let dataObj = {
        FILEId: uuidV4()
    }

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

    rs.pipe(ws).on('finish', () => {
        rimraf(file.path, err => {
            if (err) {
                console.log(`删除临时文件失败: ${err.message}`);
            }
        });

        if (total - 1 === chunk) {
            const finalPath = path.resolve(file.destination, originalname);
            fs.rename(filePath, finalPath);

            // 将文件添加到upload文件夹
            // 新建流
            const rs_last = fs.createReadStream(finalPath);
            const ws_last = fs.createWriteStream(uploadFilePath, {
                flags: 'a+'
            });
            rs_last.pipe(ws_last).on('finish', () => {
                const fileAc = path.resolve(__dirname, `../../../uploads/${FILEId}.${fileType(type)}`);
                fs.rename(uploadFilePath, fileAc);

                // rimraf(path.resolve(finalPath, '../'), err => {
                //     if (err) {
                //         console.log(`删除临时文件失败: ${err.message}`);
                //     }
                // });

                const flag = await FILE.create({
                    ...dataObj,
                });
            });
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
    });
    rs.on('error', err => {
        rs.end();
        ws.end();
        throw new Error('上传文件写入失败');
    });

    ctx.body = {
        data: {
            fileId: dataObj.FILEId
        },
        returnCode: '1001',
        messafe: 'success'
    }
}