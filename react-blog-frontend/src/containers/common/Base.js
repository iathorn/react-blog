import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as baseActions from 'store/modules/base';
import LoginModalContainer from 'containers/modal/LoginModalContainer';
import { inform } from 'lib/shouldCancel';
class Base extends Component {
    initialize = async () => {
        const { BaseActions } = this.props;
        BaseActions.checkLogin();
    }
    componentDidMount() { 
        const { BaseActions } = this.props;
        if(localStorage.logged === "true"){
            BaseActions.tempLogin();
        } 
        this.initialize();
        inform();
    }
 render() {
   return (
    <div>
        <LoginModalContainer/>
    </div>
   );
 }
}

export default connect(
  null,
  (dispatch) => ({
    BaseActions: bindActionCreators(baseActions, dispatch)
  })
)(Base);