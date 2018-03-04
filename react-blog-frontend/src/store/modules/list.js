import { createAction, handleActions } from 'redux-actions';
import * as api from 'lib/api';
import { pender } from 'redux-pender';

import { Map, List, fromJS } from 'immutable';

// action types
const GET_POST_LIST = 'list/GET_POST_LIST';

// action creator
export const getPostList = createAction(GET_POST_LIST, api.getPostList, meta => meta);

// initial state
const initialState = Map({
    posts: List(),
    lastPage: null
});

// reducer
export default handleActions({
    ...pender({
        type: GET_POST_LIST,
        onSuccess: (state, action) => {
            const { data: posts } = action.payload;
            const lastPage = action.payload.headers['last-page'];
            return state.set('posts', fromJS(posts))
                        .set('lastPage', parseInt(lastPage, 10));
        }
    })
}, initialState);