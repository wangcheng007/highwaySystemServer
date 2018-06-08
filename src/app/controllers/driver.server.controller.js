
import { auth, conf, youtu } from '../common/nodejs_sdk/index';
import uuidV4 from 'uuid/v4';

var path = require('path');

export async function  identificationDriverIdCardInformation(ctx) {
    
    const imagePath = ctx.request.query.imagePath;
    let appid = '10130654';
    let secretId = 'AKIDUrTCmK2AN1ZzIRn9i9TL8kARaYKub4OZ';
    let secretKey = 'AAzeBXntmTy5e6RsALL9oNl2BD2zoSt8';
    let userid = '1064640905';
    let domain = 0;
    let expired = Date.now() / 1000 + 86400;

    conf.setAppInfo(appid, secretId, secretKey, userid, domain)
    let authId = auth.appSign(expired, userid);

    let imgPath = path.join(__dirname, '../../../uploads', imagePath);

    const getDriverIdCardInformation = function() {
        return new Promise((resolve, reject) => {
            youtu.idcardocr(imgPath, 0, (data) => {
                if (data) {
                    resolve(data);
                } else {
                    reject();
                }
            });
        });
    };


    await Promise.all([
        getDriverIdCardInformation()
    ]).then((res) => {

        ctx.body = {
            data: {
                datas: res
            },
            returnCode: '1001',
            message: 'success'
        }
    });

}

export async function identificationLicsenceCardInformation(ctx) {
    const imagePath = ctx.request.query.imagePath;
    let appid = '10130654';
    let secretId = 'AKIDUrTCmK2AN1ZzIRn9i9TL8kARaYKub4OZ';
    let secretKey = 'AAzeBXntmTy5e6RsALL9oNl2BD2zoSt8';
    let userid = '1064640905';
    let domain = 0;
    let expired = Date.now() / 1000 + 86400;

    conf.setAppInfo(appid, secretId, secretKey, userid, domain)
    let authId = auth.appSign(expired, userid);

    let imgPath = path.join(__dirname, '../../../uploads', imagePath);

    const getDriverLicsenceInformation = function() {
        return new Promise((resolve, reject) => {
            youtu.driverlicenseocr(imgPath, 1, (data) => {
                if (data) {
                    resolve(data);
                } else {
                    reject();
                }
            });
        });
    };

    await Promise.all([
        getDriverLicsenceInformation()
    ]).then((res) => {

        ctx.body = {
            data: {
                datas: res
            },
            returnCode: '1001',
            message: 'success'
        }
    });
}

export async function addDriver(ctx) {
    const { DRIVER } = ctx.orm();
    const {  name, phoneNumber, header_img, id_card_img,  license_img,  id_card,  license} = ctx.request.query;

    let drivers = await DRIVER.findAll({
        where: {
            id_card: id_card
        }
    });

    if (drivers && drivers.length) {
        const driver = drivers[0];

        ctx.body = {
            data: {
                driverId: driver.id
            },
            returnCode: '1001',
            message: 'success'
        }
    } else {
        let driverId = uuidV4();

        let driver = {
            id: driverId,
            name,
            phoneNumber,
            header_img,
            id_card_img,
            license_img,
            id_card,
            license
        };

        let flag = await DRIVER.create(driver);

        ctx.body = {
            data: {
                driverId
            },
            returnCode: '1001',
            message: 'success'
        }
    }
}

export async function getDrivers(ctx) {
    const { DRIVER } = ctx.orm();

    let drivers = await DRIVER.findAll();

    let datas = [];
    for(let i = 0; i < drivers.length; i++) {
        datas.push({
            value: drivers[i].id,
            label: drivers[i].name + '---' + drivers[i].id_card
        })
    }

    ctx.body = {
        data: {
            drivers: datas
        },
        returnCode: '1001',
        message: 'success'
    }
}

export async function getDriverById(ctx) {
    const { DRIVER } = ctx.orm();
    const id = ctx.request.query.id;

    let driver = await DRIVER.find({
        where: {
            id: id
        }
    });

    ctx.body = {
        data: {
            driver
        },
        returnCode: '1001',
        message: 'success'
    }
}
