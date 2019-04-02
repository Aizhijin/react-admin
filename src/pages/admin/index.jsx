import React ,{Component} from 'react';

import {getItem} from '../../untils';
import save from '../../untils/start';

export default class Admin extends Component{
    constructor(props){
        super(props);

        const user=getItem();
        if (!user){
            //跳转页面
            return this.props.history.replace('/login')
        }
        //保存到内存中
        save.user=user;

    }
    render(){
        return <div>

        </div>
    }
}