const siteRouter = require('./site');
const appRouter = require('./app');
const userRouter = require('./user');
const dashboardRouter = require('./dashboard');
const { authMiddleware } = require('../app/middleware/IsAuthenticatedMiddleware')
const returnBack = require('../app/middleware/BackMiddleware')
const errorMiddleware = require('../app/middleware/ErrorMiddleware')

function route(app) {
    app.use("/app", returnBack, appRouter);
    app.use("/dashboard", authMiddleware.authUser(), dashboardRouter)
    app.use("/user", userRouter);
    app.use("/", returnBack, siteRouter);
    app.use("*", errorMiddleware);
}

module.exports = route;