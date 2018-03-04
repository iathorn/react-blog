import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as baseActions from 'store/modules/base';
import LoginModal from 'components/modal/LoginModal';
class LoginModalContainer extends Component {
    handleCancel = () => {
        const { BaseActions } = this.props;
        BaseActions.hideModal('login');

        
    }

    handleLogin = async () => {
        const { BaseActions, password } = this.props;
        try{
            await BaseActions.login(password);
            BaseActions.hideModal('login');
            localStorage.logged = 'true';
        } catch(e){ 
            console.error(e);
        }

    }

    handleChange = (e) => {
        const { BaseActions } = this.props;
        const { value } = e.target;
        BaseActions.changePasswordInput(value);
    }

    handleKeyPress = (e) => {
        if(e.key === 'Enter') {
            this.handleLogin();
        }
    }
    render() {
        const { handleLogin, handleCancel, handleChange, handleKeyPress } = this;
        const { visible, error, password } = this.props;
        return (
            <LoginModal
                onLogin={handleLogin}
                onCancel={handleCancel}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                visible={visible}
                error={error}
                password={password}
                />
        );
    }
}
export default connect((state) => 
({
visible: state.base.getIn(['modal', 'login']),
password: state.base.getIn(['loginModal', 'password']),
error: state.base.getIn(['loginModal', 'error'])
}), (dispatch) => ({
    BaseActions: bindActionCreators(baseActions, dispatch)
}))(LoginModalContainer);