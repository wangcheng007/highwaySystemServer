
// 获取level列表
export async function getAllLevel(ctx, next) {
    const { LEVEL } = ctx.orm();

    let levelList = await LEVEL.findAll({
        attributes: [['id', 'value'], ['level_name', 'label']]
    });

    return levelList;
}