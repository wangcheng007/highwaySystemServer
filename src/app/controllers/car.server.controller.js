import { auth, conf, youtu } from '../common/nodejs_sdk/index';
import Sequelize from 'sequelize';
import uuidV4 from 'uuid/v4';

var path = require('path');

const Op = Sequelize.Op;

export async function  identificationCarInformation(ctx) {
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

    const getCarInformation = function() {
        return new Promise((resolve, reject) => {
            youtu.plateocr(imgPath, (data) => {
                if (data) {
                    resolve(data);
                } else {
                    reject();
                }
            });
        });
    };


    await Promise.all([
        getCarInformation()
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


export async function getCarAttributes(ctx) {
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

    const getCarInformation = function() {
        return new Promise((resolve, reject) => {
            youtu.carclassify(imgPath, (data) => {
                if (data) {
                    resolve(data);
                } else {
                    reject();
                }
            });
        });
    };


    await Promise.all([
        getCarInformation()
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

export async function initCar(ctx) {
    const { CAR, CARTYPE, USER, DRIVER, CAR_CARTYPE } = ctx.orm();
    const { currentPage, pageSize, car_id, types, driver, startTime, endTime } = ctx.query;
    const userinfo = ctx.session.userinfo;

    let cartypes = await CARTYPE.findAll({
        attributes: [['id', 'value'], ['cartype_name', 'label']]
    });

    const query = [{
		type: 'text',
		name: 'car_id',
		placeholder: '请输入车牌号'
    }, {
        type: 'text',
		name: 'driver',
		placeholder: '请输入驾驶员姓名'
    }, {
        type: 'select',
        name: 'types',
        placeholder: '请选择特征',
        multiple: true,
        options: cartypes
    },{
		type: 'date',
		label: '日期',
		name: 'startTime',
		placeholder: '开始日期'
	}, {
		type: 'date',
		label: '日期',
		name: 'endTime',
		placeholder: '结束日期'
	}];

    const columns = [{
        label: '创建者',
        align: 'center',
        prop: 'create'
    }, {
        label: '车牌号',
        align: 'center',
        prop: 'car_id'
    }, {
        label: '驾驶员姓名',
        align: 'center',
        prop: 'driver'
    }, {
        label: '车辆信息',
        align: 'center',
        prop: 'cartype'
    }, {
        label: '车辆图片',
        align: 'center',
        prop: 'car_imgs'
    }, {
        label: '状态',
        align: 'center',
        prop: 'status'
    }, {
        label: '审核人',
        align: 'center',
        prop: 'agent'
    }, {
        label: '车辆注册时间',
        align: 'center',
        prop: 'time'
    }, {
        label: '操作',
        align: 'center',
        prop: 'operate'
    }];

    let whereStat = {};
    let whersStamp = {};

	if (car_id) {
		whereStat.car_id = car_id;
	}

	if (driver) {
		whersStamp.name = driver;
	}

	if (startTime) {
		whereStat.car_time = {
			[Op.gte]: startTime
		}
	} 

	if (endTime) {
		whereStat.car_time = Object.assign(whereStat.car_time, {[Op.lte]: endTime});
    }
    
    let car_types = null;
    if (types) {
        let typeList = types.split(',');
        car_types = await CAR_CARTYPE.findAll({
            where: {
                CARTYPEId: {
                    [Op.in]: typeList
                }
            },
            group: 'CARId'
        });
    } else {
        car_types = await CAR_CARTYPE.findAll({
            group: 'CARId'
        });
    }

    let carIds = [];
    for(let i = 0; i < car_types.length; i++){
        carIds.push(car_types[i].CARId);
    }

    let userStamp = {};
    if(userinfo.level === '2') {
        userStamp.DEPARTMENTId = userinfo.department
    } else if (userinfo.level === '3') {
        userStamp.id = userinfo.id
    }

    let cars = await CAR.findAll({
        where: {
            ...whereStat,
            id: {
                [Op.in]: carIds
            }
        },
        offset: parseInt((currentPage - 1) * pageSize),
        limit: parseInt(pageSize),
        include: [
            {
                model: USER,
                where: {
                    ...userStamp
                }
            }, {
                model: DRIVER,
                where: {
                    ...whersStamp
                }
			}, {
                model: CARTYPE
            }
        ]
    });

    let datas = [];

    for(let i = 0; i < cars.length; i++) {
        let cartypes = cars[i].CARTYPEs.map((item) => {
            return item.cartype_name
        });

        datas.push({
            id: cars[i].id,
            create: cars[i].USER.username,
            car_id: cars[i].car_id,
            driver: cars[i].DRIVER.name,
            cartype: cartypes.join(','),
            car_imgs: cars[i].car_imgs,
            status: cars[i].car_status,
            agent: cars[i].agent_id,
            time: cars[i].car_time
        });
    }

    ctx.body = {
        data: {
            query,
            columns,
            cars,
            datas
        },
        returnCode: '1001',
        message: 'success'
    }
}

export async function addCar(ctx) {
    const { CAR, CAR_CARTYPE } = ctx.orm();
    let { car_time, car_id, car_imgs, DRIVERId, types } = ctx.request.query;
    const user_id = ctx.session.userinfo.id;

    const cars = await CAR.findAll({
        where: {
            car_id
        }
    });

    if (cars && cars.length) {
        ctx.body = {
            data: {

            },
            returnCode: '4000',
            message: '当前车辆信息已存在，请不要重复添加'
        }
    } else {
        let carId = uuidV4();

        let flag = await CAR.create({
            id: carId,
            car_time,
            car_id,
            car_status: 0,
            agint_id: null,
            car_imgs,
            time_stamp: Date.now() + '',
            USERId: user_id,
            DRIVERId
        });

        let typeList = types.split(',');
        for(let i = 0; i < typeList.length; i++) {
            flag = await CAR_CARTYPE.create({
                id: uuidV4(),
                CARTYPEId: typeList[i],
                CARId: carId
            })
        }

        ctx.body = {
            data: {
                carId
            },
            returnCode: '1001',
            message: 'success'
        }
    }
}

export async function updateCar(ctx) {
    const { CAR } = ctx.orm();
    const { status, id } = ctx.request.query;
    const agent_name = ctx.session.userinfo.username;

    let flag = null;
    if (status !== '3') {
        flag = await CAR.update({
            car_status: status,
            agent_id: agent_name
        }, {
            where: {
                id: id
            }
        });
    } else {
        flag = await CAR.update({
            car_status: status
        }, {
            where: {
                id: id
            }
        });
    }

    ctx.body = {
        data: {
            flag
        },
        returnCode: '1001',
        message: 'success'
    }

}

export async function getDetailCar(ctx) {
    const { CAR, DRIVER, CARTYPE } = ctx.orm();
    const car_id = ctx.request.query.id;

    let car = await CAR.find({
        where: {
            id: car_id
        },
        include: [{
            model: DRIVER
        }, {
            model: CARTYPE
        }]
    });

    ctx.body = {
        data: {
            detailCar: car
        },
        returnCode: '1001',
        message: 'success'
    }
}

export async function getCarDetailByCar_Id(ctx) {
    const { CAR } = ctx.orm();
    const car_id = ctx.request.query.car_id;

    let cars = await CAR.findAll({
        where: {
            car_id: car_id
        }
    });

    if(cars && cars.length) {
        ctx.body = {
            data: {
                flag: 1,
                id: cars[0].id
            },
            returnCode: '1001',
            message: 'success'
        }
    } else {
        ctx.body = {
            data: {
                flag: 0
            },
            returnCode: '1001',
            message: 'success'
        }
    }
}

export async function updateCarInformation(ctx) {
    const { CAR, CAR_CARTYPE } = ctx.orm();
    const {id, car_time, car_id, car_imgs, DRIVERId, types} = ctx.request.query;
    const user_id = ctx.session.userinfo.id;

    let flag = await CAR.update({
        car_time,
        car_id,
        car_status: 0,
        agent_id: null,
        car_imgs,
        DRIVERId
    }, {
        where: {
            id: id
        }
    });

    flag = await CAR_CARTYPE.destroy({
        where: {
            CARId: id
        }
    });

    let typeList = types.split(',');
    for(let i = 0; i < typeList.length; i++) {
        flag = await CAR_CARTYPE.create({
            id: uuidV4(),
            CARTYPEId: typeList[i],
            CARId: id
        })
    }

    ctx.body = {
        data: {
            id
        },
        returnCode: '1001',
        message: 'success'
    }
}