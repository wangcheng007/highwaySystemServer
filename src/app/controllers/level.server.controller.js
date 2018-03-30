
// 获取level列表
export async function getAllLevel(ctx, next) {
    const { LEVEL } = ctx.orm();

    let levelList = await LEVEL.findAll({
        attributes: [['id', 'value'], ['level_name', 'label']]
    });

    return levelList;
}

// 获取department列表
export async function getLevels(ctx, next) {
    const { LEVEL } = ctx.orm();

    let levelList = await LEVEL.findAll({
        attributes: [['id', 'value'], ['level_name', 'label']]
    });

    if (levelList && levelList.length) {
        ctx.body = {
            data:{
                levelList
            },
            returnCode: '1001',
            message: 'success'
        }
    } else {
        ctx.body = {
            data:{},
            returnCode: '400',
            message: 'fail'
        }
    }
}
