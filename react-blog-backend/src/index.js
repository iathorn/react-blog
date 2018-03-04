require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');

const ssr = require('./ssr');

const path = require('path');
const serve = require('koa-static');

const staticPath = path.join(__dirname, '../../react-blog-frontend/build');

const api = require('./api');

const mongoose = require('mongoose');

const {
    PORT: port = 4000,
    MONGO_URI: mongoURI,
    COOKIE_SIGN_KEY: signKey
} = process.env;

mongoose.Promise = global.Promise;
mongoose.connect(mongoURI).then(() => {
    console.log('connected to mongodb');
}).catch((e) => {
    console.error(e);
});

const app = new Koa();
const router = new Router();

router.use('/api', api.routes());
router.get('/', ssr);

app.use(bodyParser());

const sessionConfig = {
    maxAge: 1000 * 60 * 60 * 24
};

app.use(session(sessionConfig, app));
app.keys= [signKey];

app.use(router.routes()).use(router.allowedMethods());
app.use(serve(staticPath));
app.use(ssr);

app.listen(port, () => {
    console.log("app is listening port", port);
});
