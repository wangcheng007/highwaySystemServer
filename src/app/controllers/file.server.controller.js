import multer from 'koa-multer';
import uuidV5 from 'uuid/v5';
import uuidV4 from 'uuid/v4';
import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import { reject } from 'any-promise';

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
    const { FILE, USER } = ctx.orm();
    const user_id = ctx.session.userinfo.id;

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

    // const finalPath = path.resolve(file.destination, `${originalname}.tmp`);

    const rs = fs.createReadStream(file.path);
    const ws = fs.createWriteStream(filePath, {
        flags: 'a+'
    });

    const renameFile =  function () {
        return new Promise((resolve, reject) => {
            if (total - 1 === chunk) {
                const finalPath = path.resolve(file.destination, `${originalname}.tmp`);
                fs.renameSync(filePath, finalPath);

                const rs_last = fs.createReadStream(finalPath);
                const ws_last = fs.createWriteStream(uploadFilePath, {
                    flags: 'a+'
                });

                rs_last.pipe(ws_last).on('finish', () => {
                    const fileAc = path.resolve(__dirname, `../../../uploads/${FILEId}.${fileType(type)}`);
                    fs.renameSync(uploadFilePath, fileAc);

                    rimraf(path.resolve(finalPath, '../'), err => {
                        if (err) {
                            console.log(`删除临时文件失败: ${err.message}`);
                        }
                    });

                    resolve();
                });
            }
            
        });
    }

    const finishUploadFile = function() {
        return new Promise((resolve, reject) => {
            try {
                rs.pipe(ws).on('finish', () => {
                    rimraf(file.path, err => {
                        if (err) {
                            reject();
                        }
                    });

                    resolve();
                });
            } catch (error) {
                reject();
            }
        }) 
    }

    const createFile = function() {
        return new Promise((resolve, reject) => {
            let flag = FILE.create({
                id: FILEId,
                file_name: originalname,
                file_path: `${FILEId}.${fileType(type)}`,
                file_des: '',
                time_stamp: `${Date.now()}`
            });

            if(flag) {
                resolve()
            }else {
                reject();
            }
        }) 
    }
    
    await Promise.all([
        finishUploadFile(),
        createFile()
    ]).then(async () => {

        await Promise.all([
            renameFile()
        ]).then(() => {
            ctx.body = {
                data: {
                    imgPath: `${FILEId}.${fileType(type)}`,
                    id: FILEId
                },
                returnCode: '1001',
                message: 'success'
            }
        })
    })
}


export async function downloadFile(ctx) {
    const file_id = ctx.params.id;
    const file_path = path.resolve(__dirname, `../../../uploads/${file_id}`);

    if (fs.existsSync(file_path)) {
        ctx.body = fs.createReadStream(file_path);
    } else {
        ctx.body = {
            data:{},
            returnCode: '4004',
            message: 'fail'
        }
    }
}
