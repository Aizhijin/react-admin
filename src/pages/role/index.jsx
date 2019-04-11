import React, {Component, Fragment} from 'react';
import {Card, Button, Table, Radio, Modal, message} from 'antd';
import dayjs from 'dayjs'

import AddRoleForm from './add-role-form';
import UpdateRoleForm from './update-role-form';
import {reqAddRole, reqGetRoles, reqUpdateRoles} from '../../api'
import User from '../../untils/start';

const RadioGroup = Radio.Group;

export default class Role extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',  // 单选的默认值，也就是选中的某个角色的id值
            roles: [], // 权限数组
            isShowAddRoleModal: false, // 是否展示创建角色的标识
            isShowUpdateRoleModal: false, // 是否展示设置角色的标识
            isDisabled: true,// 设置角色权限按钮是否禁止使用
            role: {}//选中角色
        };

        this.addRoleForm = React.createRef();
        this.updateRoleForm = React.createRef();
    }

    columns = [
        {
            dataIndex: '_id',
            render: id => <Radio value={id}/>
        },
        {
            title: '角色名称',
            dataIndex: 'name',
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            render: (time) => time && dayjs(time).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '授权时间',
            dataIndex: 'auth_time',
            render: (time) => time && dayjs(time).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '授权人',
            dataIndex: 'auth_name',
        }
    ];

    onRadioChange = (e) => {
        const value = e.target.value;
        const role = this.state.roles.find((item) => item._id === value);
        this.setState({
            value,
            isDisabled: false,
            role
        });
    };

    changeModal = (name, flag) => {
        return () => {
            this.setState({[name]: flag})
        }
    };

    //创建角色的回调函数
    handleAddRole = () => {
        const {validateFields, resetFields} = this.addRoleForm.current;
        validateFields(async (err, value) => {
            if (!err) {
                const {name} = value;
                const result = await reqAddRole({name});
                //发送请求
                if (result.status === 0) {
                    this.setState({
                        roles: [...this.state.roles, result.data],
                        isShowAddRoleModal: false
                    })
                } else {
                    message.error(result.msg);
                }
                resetFields();
            }
        })
    };

    //子组件更新角色权限信息
    updateRoles = (menus) => {
        this.setState({
            role: {...this.state.role, menus}
        })
    };
    //设置角色权限的回调函数
    handleUpdateRole = async () => {
        const {role, roles} = this.state;
        role.auth_time = Date.now();
        role.auth_name = User.user.username;
        const result = await reqUpdateRoles({role});
        if (result.status === 0) {
            message.success(role.name + '的权限修改成功');
            this.setState({
                isShowUpdateRoleModal: false,
                roles: roles.map((item) => {
                    if (item._id === role._id) {
                        return role;
                    }
                    return item;
                })
            })
        } else {
            message.error(result.msg)
        }
    };
    //获取角色
    getRoleList = async () => {
        const result = await reqGetRoles();
        if (result.status === 0) {
            this.setState({
                roles: result.data
            })
        } else {
            message.error(result.msg)
        }

    };

    componentDidMount() {
        this.getRoleList()
    }

    render() {
        const {roles, value, isDisabled, isShowAddRoleModal, isShowUpdateRoleModal, role} = this.state;

        return (
            <Card
                title={
                    <Fragment>
                        <Button type='primary'
                                onClick={this.changeModal('isShowAddRoleModal', true)}>创建角色</Button> &nbsp;&nbsp;
                        <Button type='primary' disabled={isDisabled}
                                onClick={this.changeModal('isShowUpdateRoleModal', true)}>设置角色权限</Button>
                    </Fragment>
                }
            >
                <RadioGroup onChange={this.onRadioChange} value={value} style={{width: '100%'}}>
                    <Table
                        columns={this.columns}
                        dataSource={roles}
                        bordered
                        rowKey='_id'
                        pagination={{
                            defaultPageSize: 5,
                            showSizeChanger: true,
                            pageSizeOptions: ['5', '10', '15', '20'],
                            showQuickJumper: true,
                        }}
                    />
                </RadioGroup>

                <Modal
                    title="创建角色"
                    visible={isShowAddRoleModal}
                    onOk={this.handleAddRole}
                    onCancel={this.changeModal('isShowAddRoleModal', false)}
                    okText='确认'
                    cancelText='取消'
                >
                    <AddRoleForm ref={this.addRoleForm}/>
                </Modal>

                <Modal
                    title="设置角色权限"
                    visible={isShowUpdateRoleModal}
                    onOk={this.handleUpdateRole}
                    onCancel={this.changeModal('isShowUpdateRoleModal', false)}
                    okText='确认'
                    cancelText='取消'
                >
                    <UpdateRoleForm ref={this.updateRoleForm} updateRoles={this.updateRoles} role={role}/>
                </Modal>

            </Card>
        )
    }
}
