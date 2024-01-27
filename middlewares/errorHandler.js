module.exports = (app) => {
    app.use((req, res) => {
        res.status(404).render("error", {
            layout: false,
            statusCode: 404,
            message: "Page not found"
        });
    });

    app.use((err, req, res, next) => {
        const sc = err.statusCode || 500;
        res.status(sc).render('error', {
            layout: false,
            statusCode: sc,
            message: err.message,
            description: err.stack
        });
    });
}