
export default function(app, config) {
    app.use(async (ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', config.allowOrign.join(','));
        ctx.set('Access-Control-Max-Age', '5');
        ctx.set('Access-Control-Allow-Credentials', 'true');
        ctx.set('Access-Control-Allow-Methods', 'POST,DELETE,POST,GET');
        ctx.set('Access-Control-Allow-Headers', 'X-Requested-With');

        await next();
    })
}