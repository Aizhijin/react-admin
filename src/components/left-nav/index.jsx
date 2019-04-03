import React, {Component,Fragment} from 'react';
import {Link, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Icon, Menu} from "antd";
import menulist from '../../config/menu-config'
import logo from "../../assets/img/logo.png";

const {Item, SubMenu} = Menu;

@withRouter
class LeftNav extends Component {
    static propTypes = {
        opacity: PropTypes.number.isRequired
    };
    constructor(props) {
        super(props);
        const openKey = [];
        this.menu = this.createMenu(menulist, openKey);
        this.state = {
            openKey
        };
    }

    createItem(item) {
        return <Item key={item.key}>
            <Link to={item.key}>
                <Icon type={item.icon}/>
                <span>{item.title}</span>
            </Link>
        </Item>
    }

    createMenu(menulist,openKey) {
        console.log(this.state)
        const {pathname} = this.props.location;
        return menulist.map((item) => {
            const son = item.children;
            if (son) {
                return <SubMenu
                    key={item.key}
                    title={<span><Icon type={item.icon}/><span>{item.title}</span></span>}>
                    {
                        son.map((singel) => {
                        if (singel.key === pathname) {
                            //无法对未装入的组件使用 setState ，所以使用引用
                                openKey.push(item.key)
                        }
                        return this.createItem(singel)
                    })} </SubMenu>
            } else {
                return this.createItem(item)
            }
        })
    }
    handleOpenChange = (openKey) => {
        this.setState({openKey})
    };

    handelClick=()=>{
        this.setState({
            openKey:[]
        })
    };
    render() {
        const {location:{pathname},opacity} = this.props;
        return (
            <Fragment>
                <Link to='/home'>
                    <div className="logo" onClick={this.handelClick}>
                        <img src={logo} alt='logo'/>
                        <h2 style={{opacity}}>硅谷后台</h2>
                    </div>
                </Link>
                <Menu theme="light" selectedKeys={[pathname]}  openKeys={this.state.openKey} onOpenChange={this.handleOpenChange}
                      mode="inline"> {this.menu}</Menu>
            </Fragment>

        )
    }
}

export default LeftNav