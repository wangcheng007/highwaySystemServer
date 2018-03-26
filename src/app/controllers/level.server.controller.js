export async function getAllLevel(ctx, next) {
    const { Level } = ctx.orm();

    let levelList = await Level.findAll({
        attributes: [['id', 'value'], ['level_name', 'label']]
    });

    return levelList;
}