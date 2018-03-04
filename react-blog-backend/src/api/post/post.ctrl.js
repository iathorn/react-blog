const Post = require('models/post');
const Joi = require('joi');

const { ObjectId } = require('mongoose').Types;

exports.checkObjectId = async (ctx, next) => {
    const { id } = ctx.params;
    if(!ObjectId.isValid(id)){
        ctx.status = 400;
        return;
    }
    return next();

}

exports.checkLogin = async (ctx, next) => {
    if(!ctx.session.logged) {
        ctx.status = 401;
        return null;
    }

    return next();
}

exports.list = async (ctx) => {

    const page = parseInt(ctx.query.page || 1, 10);

    if(page < 1){
        ctx.status = 400;
        return;
    }

    const { tag } = ctx.query;

    const query = tag ? {
        tags: tag
    } : {};


    try{
        const posts = await Post.find(query)
                                .sort({_id: -1})
                                .limit(10)
                                .skip((page - 1) * 10)
                                .lean()
                                .exec();
        const postCount = await Post.count(query).exec();
        const limitBodyLength = post => ({
            ...post,
            body: post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`
        });
        ctx.body = posts.map(limitBodyLength);
        ctx.set('Last-Page', Math.ceil(postCount / 10));
    } catch(e){
        ctx.throw(e, 500);
    }

}

exports.read = async (ctx) => {
    const { id } = ctx.params;
    try {
        const post = await Post.findById(id).exec();
        if(!post){
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    } catch(e){
        ctx.throw(e, 500);
    }
}

exports.write = async (ctx) => {
    const schema = Joi.object().keys({
        title: Joi.string().required(),
        body: Joi.string().required(),
        tags: Joi.array().items(Joi.string()).required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if(result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    const { title, body, tags } = ctx.request.body;

    const post = new Post({
        title,
        body,
        tags
    });

    try{
        await post.save();
        ctx.body = post;
    } catch(e){
        ctx.throw(e, 500);
    }
    
}

exports.remove = async (ctx) => {
    const { id } = ctx.params;
    try {
        await Post.findByIdAndRemove(id).exec();
        ctx.status = 204;
    } catch(e){
        ctx.throw(e, 500);
    }
}

exports.update = async (ctx) => {
    const { id } = ctx.params;

    try {
        const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
            new: true
        }).exec();
        if(!post) {
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    } catch(e){
        ctx.throw(e, 500);
    }
}