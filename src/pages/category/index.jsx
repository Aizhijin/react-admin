import React, {Component} from 'react';
import {Card, Button, Table, message, Icon, Modal} from 'antd';

import MyButton from '../../components/my-button';
import AddCategory from './add-category';
import UpdateCategory from './update-category'
import {reqGetCategorys, reqAddCategorys, reqUpdateCategorys} from '../../api'
import './index.less'

export default class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],//一级分类数据
            isShowAddModal: false,
            isShowUpdateModal: false,
            category: {},//要操作的分类数据
            isShowSubCategory: false,//是否显示二级分类
            subCategories: [],//二级分类数据
            parentCategory: {}//操作的二级分类
        };
        this.addCategoryRef = React.createRef();
        this.createUpdateForm = React.createRef();

    }

    columns = [//定义成属性 减少重复定义
        {
            title: '品类名称', // 表头的名称
            // className: 'column-money',
            dataIndex: 'name', // 显示data数据中的某个属性的值
        },
        {
            title: '操作',
            className: 'operator',
            /* dataIndex: 'operator',*/
            render: category => (
                <div>
                    <MyButton onClick={this.ShowUpdateModal(category)}>修改名称</MyButton>
                    {this.state.isShowSubCategory ? null :
                        <MyButton onClick={this.showSubCategory(category)}>查看其子品类</MyButton>}
                </div>
            ),
        }
    ];
    showSubCategory = (parentCategory) => {
        return () => {
            this.setState({
                parentCategory,
                isShowSubCategory: true,
            });
            //请求二级分类数据
            this.getCategories(parentCategory._id);
        }
    };

    ShowUpdateModal = (category) => {
        return () => {
            this.setState({
                category
            });
            this.changeModal('isShowUpdateModal', true)()
        }
    };

    //发送请求信息
    getCategories = async (parentId) => {
        const result = await reqGetCategorys(parentId);
        if (result.status === 0) {
            if (parentId === '0') {//判断是一级还是二级
                this.setState({
                    categories: result.data
                })
            } else {
                this.setState({
                    subCategories: result.data
                })
            }
        } else {
            message.error(result.msg);
        }
    };

    changeModal = (name, bol) => {
        return () => {
            this.setState({
                [name]: bol
            })
        }
    };

    addCategory = () => {
        const {validateFields, resetFields} = this.addCategoryRef.current.props.form;
        validateFields(async (err, values) => {
            if (!err) {
                //校验成功  发送请求 添加分类数据 、隐藏对话框、提示添加分类成功、更新列表
                const {parentId, categoryName} = values;
                const resualt = await reqAddCategorys(parentId, categoryName);
                if (resualt.status === 0) {
                    message.success('添加分类成功~~');
                    if (parentId === 0) {
                        this.setState({
                            isShowAddModal: false,
                            categories: [...this.state.categories, resualt.data]
                        });
                    } else if (parentId === this.state.parentCategory._id) {//在二级分类页面添加需要显示
                        this.setState({
                            isShowAddModal: false,
                            subCategories: [...this.state.subCategories, resualt.data]
                        });
                    }
                    //清除表单数据
                    resetFields();
                }
            } else {
                //校验失败
            }
        })
    };

    //取消添加和修改后，清除表单数据
    onCancelForm = (name, bol, ref) => {
        return () => {
            const {resetFields} = this[ref].current.props.form;
            //修改弹出框状态
            this.changeModal(name, bol)();
            resetFields();
        }
    };

    //修改分类名称
    updateCategoryName = () => {
        const {validateFields, resetFields} = this.createUpdateForm.current.props.form;
        validateFields(async (err, values) => {
            if (!err) {//校验通过
                const {categoryName} = values;
                const {category: {_id}, isShowSubCategory} = this.state;
                const resualt = await reqUpdateCategorys(_id, categoryName);
                if (resualt.status === 0) {
                    //隐藏对话框、提示成功、显示修改的分类名称
                    message.success('更新分类成功~~');
                    let name = 'categories';
                    if (isShowSubCategory) {
                        name = 'subCategories'
                    }
                    this.setState({
                        isShowUpdateModal: false,
                        [name]: this.state[name].map((category) => {
                            if (category._id === _id) return {...category, name: categoryName};
                            return category;
                        })
                    });
                    resetFields();
                } else {
                    message.error(resualt.msg)
                }
            }
        });
    };

    //回退
    goBack = () => {
        this.setState({
            isShowSubCategory: false
        })
    };

    componentDidMount() {
        this.getCategories('0');
    }

    render() {
        const {categories, subCategories, isShowAddModal, isShowSubCategory, isShowUpdateModal, parentCategory, category: {name}} = this.state;
        return (
            <Card
                className="category main"
                title={isShowSubCategory ?
                    <div><MyButton onClick={this.goBack}>一级分类</MyButton> <Icon type="arrow-right"/>
                        <span>{parentCategory.name}</span>
                    </div> : '一级分类列表'}
                extra={<Button type="primary" onClick={this.changeModal('isShowAddModal', true)}><Icon type="plus"/>添加品类</Button>}
            >
                <Table
                    columns={this.columns}
                    dataSource={isShowSubCategory ? subCategories : categories}
                    bordered
                    pagination={{
                        showSizeChanger: true,
                        pageSizeOptions: ['3', '6', '9', '12'],
                        defaultPageSize: 3,
                        showQuickJumper: true,
                    }}
                    rowKey="_id"
                />
                <Modal
                    title="添加分类"
                    visible={isShowAddModal}
                    onCancel={this.onCancelForm('isShowAddModal', false, 'addCategoryRef')}
                    onOk={this.addCategory}
                    okText="确认"
                    cancelText="取消"
                >
                    <AddCategory categories={categories} wrappedComponentRef={this.addCategoryRef}/>
                </Modal>
                <Modal
                    title="修改分类名称"
                    visible={isShowUpdateModal}
                    onOk={this.updateCategoryName}
                    onCancel={this.onCancelForm('isShowUpdateModal', false, 'createUpdateForm')}
                    okText="确认"
                    cancelText="取消"
                    width={300}
                >
                    <UpdateCategory categoryName={name} wrappedComponentRef={this.createUpdateForm}/>
                </Modal>

            </Card>
        )
    }
}