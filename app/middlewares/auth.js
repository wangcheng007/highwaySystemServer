
export default function(app) {
    app.use(async (ctx, next) => {
        // if (ctx.) {

        // }

        console.log(ctx);
        await next();
    })
}