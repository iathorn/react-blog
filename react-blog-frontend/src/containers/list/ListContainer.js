import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as listActions from 'store/modules/list';
import PostList from 'components/list/PostList';
import Pagination from 'components/list/Pagination';
import shouldCancel from '../../lib/shouldCancel';
class ListContainer extends Component {

    getPostList = () => {
        if(shouldCancel()) return;
        const { tag, page, ListActions } = this.props;
        ListActions.getPostList({
            tag,
            page
        });
    }

    componentDidMount() {
        this.getPostList();
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.page !== this.props.page || prevProps.tag !== this.props.tag) {
            this.getPostList();
            document.documentElement.scrollTop = 0;
        }
    }


    render() {
        const { posts, lastPage, loading, tag, page } = this.props;
        if(loading) return null;
        return (
            <div>
                <PostList posts={posts}/>
                <Pagination page={page} lastPage={lastPage} tag={tag}/>
            </div>
        );
    }
}
export default connect((state) => ({
    posts: state
        .list
        .get('posts'),
    lastPage: state
        .list
        .get('lastPage'),
    loading: state.pender.pending['list/GET_POST_LIST']
}), (dispatch) => ({
    ListActions: bindActionCreators(listActions, dispatch)
}))(ListContainer);