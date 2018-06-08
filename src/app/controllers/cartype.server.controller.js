import uuidV4 from 'uuid/v4';

export async function  initCartype(ctx) {
    const { CARTYPE } = ctx.orm();
    const { currentPage, pageSize, cartype_name } = ctx.query;

    const query = [{
		type: 'text',
		lable: '名称',
		name: 'cartype_name',
		placeholder: '请输入特征名称'
    }];
    
    const columns = [{
		label: '特征名',
		align: 'center',
        prop: 'cartype_name'
	}, {
        label: '创建时间',
        align: 'center',
        prop: 'time_stamp'
    }];

    let whereStat = {};
    if (cartype_name) {
        whereStat.cartype_name = cartype_name;
    }

    let cartypes = await CARTYPE.findAll({
        where: {
			...whereStat
        },
        order: [
            ['time_stamp', 'DESC']
        ],
		offset: parseInt((currentPage - 1) * pageSize),
		limit: parseInt(pageSize)
    });

    ctx.body = {
        data: {
            query,
            columns,
            datas: cartypes
        },
        returnCode: '1001',
        message: 'success'
    }
}

export async function addCartype(ctx) {
    const { CARTYPE } = ctx.orm();
    const { cartype_name } = ctx.request.body;

    let cartype = {
        id: uuidV4(),
        cartype_name,
        time_stamp: Date.now() + ''
    };

    let cartypes = await CARTYPE.findAll({
        where: {
            cartype_name: cartype_name
        }
    });

    if (cartypes && cartypes.length) {
        ctx.body = {
            data: {},
            returnCode: '4000',
            message: '该特征已存在'
        }
    } else {
        let flag = await CARTYPE.create(cartype);

        ctx.body = {
            data: {
                flag
            },
            returnCode: '1001',
            message: 'success'
        }
    }
}

export async function getCartypes(ctx) {
    const { CARTYPE } = ctx.orm();

    let cartypes = await CARTYPE.findAll({
        attributes: [['id', 'value'], ['cartype_name', 'label']]
    });

    ctx.body = {
        data: {
            cartypes
        },
        returnCode: '1001',
        message: 'success'
    }
}

export async function addCartypes(ctx) {
    const { CARTYPE } = ctx.orm();
    const tagList = ctx.request.body.tagList;

    const cartypesIds = [];
    for (let i = 0; i < tagList.length; i++) {
        let cartype = await CARTYPE.findAll({
            where: {
                cartype_name: tagList[i]
            }
        });

        if(cartype && cartype.length) {
            cartypesIds.push(cartype[0].id)
        } else {
            let id = uuidV4();
            cartypesIds.push(id);

            let obj = {
                id: id,
                cartype_name: tagList[i],
                time_stamp: Date.now() + ''
            }
            let flag = await CARTYPE.create(obj);
        }
    }

    ctx.body = {
        data: {
            cartypesIds
        },
        returnCode: '1001',
        message: 'success'
    }
}