import React, {Component, Fragment} from 'react';
import {Card, Button, Table, Modal, message} from 'antd';
import dayjs from "dayjs";
import {reqAddUser, reqGetUsers, reqUpdateUser,reqDeleteUser} from '../../api'

import AddUserForm from './add-user-form';
import UpdateUserForm from './update-user-form';
import MyButton from '../../components/my-button';

export default class Role extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [], //用户数组
            roles: [],//角色列表
            isShowAddUserModal: false, //是否展示创建用户的标识
            isShowUpdateUserModal: false, //是否展示更新用户的标识
            user: {}
        };

        this.addUserForm = React.createRef();
        this.updateUserForm = React.createRef();
    }


    columns = [
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
        },
        {
            title: '电话',
            dataIndex: 'phone',
        },
        {
            title: '注册时间',
            dataIndex: 'create_time',
            render: time => dayjs(time).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '所属角色',
            /* dataIndex: 'role_id',*/
            render: (role) => {
                const {roles} = this.state;
                if (role.role_id && roles.length) {
                    const result = roles.find((item) => item._id === role.role_id);
                    return result.name
                } else return '无'
            }
        },
        {
            title: '操作',
            render: user => {
                return <Fragment>
                    <MyButton onClick={this.showUpdateModal(user)}>修改</MyButton>
                    <MyButton onClick={this.deleteUser(user._id,user.username)}>删除</MyButton>
                </Fragment>
            }
        }
    ];
    deleteUser=(_id,username)=>{
        return async ()=> {
            const result = await reqDeleteUser(_id);
            const {users}=this.state;
            if (result.status === 0) {
                message.success('已删除用户 '+username);
                this.setState({
                    users:users.filter((item)=>{
                        return item._id!==_id;
                    })
                })
            } else message.error(result.msg)

        }
    };
    //改变弹出框状态
    changeModal = (name, value) => {
        return () => {
            this.setState({[name]: value})
        }
    };
//是否更新
    showUpdateModal = (user) => {
        return () => {
            this.setState({
                user
            });
            this.changeModal('isShowUpdateUserModal', true)();
        }
    };

    //创建用户的回调函数
    handleAddUser = async () => {
        const {resetFields, validateFields} = this.addUserForm.current;
        const {users} = this.state;
        validateFields(async (err, value) => {
            const {username, password, phone, email, role_id} = value;
            if (!err) {
                const create_time = Date.now();
                const result = await reqAddUser({username, password, phone, email, role_id, create_time});
                if (result.status === 0) {
                    message.success('创建用户成功！');
                    this.setState({
                        users: [...users, result.user],
                        isShowAddUserModal: false
                    });
                    resetFields();
                } else {
                    message.error(result.msg)
                }
            }
        })
    };
    //获取用户和角色列表
    getAllUsers = async () => {
        const result = await reqGetUsers();
        if (result.status === 0) {
            this.setState({
                users: result.data.users,
                roles: result.data.roles
            })
        } else {
            message.error(result.msg);
        }
    };

    componentDidMount() {
        this.getAllUsers();
    }

    //用户数据更新
    handleUpdateUser = () => {
        const {resetFields, validateFields} = this.updateUserForm.current;
        const {user: {_id}, users} = this.state;
        validateFields(async (err, value) => {
            if (!err) {
                const {email, phone, role_id, username} = value;
                const result = await reqUpdateUser({email, phone, role_id, username, _id});
                if (result.status === 0) {
                    message.success(username + '的数据更新成功~~');
                    this.setState({
                        isShowUpdateUserModal: false,
                        users: users.map((item) => {
                            if (item._id === _id) {
                                item = {...item, email, phone, role_id, username};
                            }
                            return item
                        })
                    });
                    resetFields();
                } else {
                    message.error(result.msg);
                }
            }
        })
    };

    render() {
        const {users, isShowAddUserModal, isShowUpdateUserModal, roles, user} = this.state;
        return (
            <Card
                title={
                    <Button type='primary' onClick={this.changeModal('isShowAddUserModal', true)}>创建用户</Button>
                }
            >
                <Table
                    columns={this.columns}
                    dataSource={users}
                    bordered
                    rowKey='_id'
                    pagination={{
                        defaultPageSize: 5,
                        showSizeChanger: true,
                        pageSizeOptions: ['5', '10', '15', '20'],
                        showQuickJumper: true,
                    }}
                />

                <Modal
                    title="创建用户"
                    visible={isShowAddUserModal}
                    onOk={this.handleAddUser}
                    onCancel={this.changeModal('isShowAddUserModal', false)}
                    okText='确认'
                    cancelText='取消'
                >
                    <AddUserForm ref={this.addUserForm} roles={roles}/>
                </Modal>

                <Modal
                    title="更新用户"
                    visible={isShowUpdateUserModal}
                    onOk={this.handleUpdateUser}
                    onCancel={this.changeModal('isShowUpdateUserModal', false)}
                    okText='确认'
                    cancelText='取消'
                >
                    <UpdateUserForm ref={this.updateUserForm} roles={roles} user={user}/>
                </Modal>

            </Card>
        )
    }
}
