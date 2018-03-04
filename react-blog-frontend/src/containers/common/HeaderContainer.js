import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import Header from 'components/common/Header';
import * as baseActions from 'store/modules/base';
class HeaderContainer extends Component {

    handleRemove = () => {
        const { BaseActions } = this.props;
        BaseActions.showModal('remove');
    }
    render() {
        const {handleRemove} = this;
        const {match, logged} = this.props;
        const { id } = match.params;

        return (
            <Header 
                postId={id}
                onRemove={handleRemove}
                logged={logged}
            />
        );
    }
}
export default connect(
    (state) => ({
        logged: state.base.get('logged')
    }),
    (dispatch) => ({
        BaseActions: bindActionCreators(baseActions, dispatch)
    })
)(withRouter(HeaderContainer));