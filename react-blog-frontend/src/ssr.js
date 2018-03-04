import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';
import { Provider } from 'react-redux';
import configure from 'store/configure';
import routes from './routes';
import axios from 'axios';
import transit from 'transit-immutable-js';
import { Helmet } from 'react-helmet';

import App from 'components/App';

const render = async (ctx) => {
    const { url, origin } = ctx;
    
    axios.defaults.baseURL = origin;

    const store = configure();

    const promises = [];

    routes.forEach(
        route => {
            const match = matchPath(url, route);
            if(!match) return;
            const { component } = route;
            const { preload } = component;
            if(!preload) return;
            const { params } = match;
            const promise = preload(store.dispatch, params);
            promises.push(promise);
        }
    );

    try{
        await Promise.all(promises);
    } catch(e){

    }


    const context = {};

    const html = ReactDOMServer.renderToString(
        <Provider store={store}>
            <StaticRouter location={url} context={context}>
                <App />
            </StaticRouter>
        </Provider>
    );

    if(context.isNotFound){
        ctx.status = 404;
    }

    const helmet = Helmet.renderStatic();



    const preloadedState = JSON.stringify(transit.toJSON(store.getState()))
                                        .replace(/</g, '\\u003c');

    return {html, preloadedState, helmet};
}

export default render;