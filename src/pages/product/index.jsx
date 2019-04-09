import React, {Component} from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';

import SaveUpdate from './save-update'
import Detail from './detail'
import Index from './index/index'

export default class Products extends Component {
    render() {
        return <Switch>
            <Route path='/product/index' component={Index}/>
            <Route path='/product/detail' component={Detail}/>
            <Route path='/product/saveupdate' component={SaveUpdate}/>
            <Redirect to='/product/index'/>
        </Switch>
    }
}