import uuidV4 from 'uuid/v4';

// 初始化
export async function initCaseType(ctx) {
    const { CASETYPE } = ctx.orm();
    const { currentPage, pageSize, title } = ctx.query;

    let whereStat = {};

	if (title) {
		whereStat.case_type_name = title;
    }

    const query = [{
		type: 'text',
		lable: '名称',
		name: 'title',
		placeholder: '请输入名称'
    }];

    const columns = [{
		label: '名称',
		align: 'center',
        prop: 'title'
	}, {
		label: '创建时间',
		align: 'center',
		prop: 'createtime'
	}];

    const casetypes =  await CASETYPE.findAll({
        where: {
			...whereStat
		},
        offset: parseInt((currentPage - 1) * pageSize),
		limit: parseInt(pageSize),
        order: [
            ['time_stamp', 'DESC']
        ]
    });

    let datas = [];
    casetypes.forEach((casetype) => {
        datas.push({
            id: casetype.id,
            title: casetype.case_type_name,
            createtime: casetype.time_stamp
        });
    });

    ctx.body = {
        data: {
            query,
            columns,
            datas
		},
		returnCode: '1001',
		message: 'success' 
    }
}

export async function addCasetype(ctx) {
    const { CASETYPE } = ctx.orm();
    let title = ctx.request.body.title;
    let data = {};

    data.case_type_name = title;
    data.id = uuidV4();
    data.time_stamp = Date.now() + '';

    let casetypes = await CASETYPE.findAll({
		where: {
			case_type_name: data.case_type_name
		}
    });
    

    if (casetypes && casetypes.length) {
		ctx.body = {
			data: {},
			returnCode: '4000',
			message: '该案件类型已存在' 
		}

		return;
    }

    let flag = await CASETYPE.create(data);
    if (flag) {
		ctx.body = {
			data: {
				flag: flag
			},
			returnCode: '1001',
			message: 'success' 
		}
	} else {
		ctx.body = {
			data: {},
			returnCode: '2002',
			message: 'fail' 
		}
	}
}

export async function getAllCaseTypes(ctx) {
    const { CASETYPE } = ctx.orm();

    const casetypes = await CASETYPE.findAll({
        attributes: [['id', 'value'], ['case_type_name', 'label']]
    });

    return casetypes;
}

export async function getCaseTypeList(ctx) {
    const { CASETYPE } = ctx.orm();

    const casetypes = await CASETYPE.findAll({
        attributes: [['id', 'value'], ['case_type_name', 'label']]
    });

    ctx.body = {
        data: {
            casetypes
        },
        returnCode: '1001',
        message: 'success'
    }
}
