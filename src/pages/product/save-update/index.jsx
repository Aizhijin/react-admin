import React, {Component} from 'react';
import {Form, Input, Cascader, Card, Icon, InputNumber, Button, message} from 'antd'

import {reqGetCategorys, reqAddProduct, reqUpdateProduct} from '../../../api/index'
import EditorDemo from './rich-text'
import PicturesWall from './pictures-wall'

import './save-update.less'

const Item = Form.Item;

@Form.create()
class SaveUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: []
        };
        this.richText = React.createRef();
    }

    formItemLayout = {
        // 调整Item中label占据多少列
        labelCol: {
            xs: {span: 24},
            sm: {span: 2},
        },
        // 调整Item的内容占据多少列
        wrapperCol: {
            xs: {span: 24},
            sm: {span: 10},
        },
    };
    //回退
    goBack = () => {
        this.props.history.goBack();
    };

    //请求二级分类处理
    loadData = (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        this.getCategories(targetOption.value)
    };

    //请求分类数据（默认一级）
    getCategories = async (parentId) => {
        const resualt = await reqGetCategorys(parentId);
        if (resualt.status === 0) {
            if (parentId === '0') {
                this.setState({
                    options: resualt.data.map((item) => {
                        return {
                            label: item.name,
                            value: item._id,
                            isLeaf: false
                        }
                    })
                })
            } else {//请求二级分类数据
                this.setState({
                    options: this.state.options.map((option) => {
                        if (option.value === parentId) {
                            option.children = resualt.data.map((item) => {
                                return {
                                    label: item.name,
                                    value: item._id
                                }
                            });
                            //去掉状态
                            option.loading = false;
                            option.isLeaf = true;
                        }
                        return option
                    })
                })
            }
        } else {
            message.error(resualt.msg);
        }
    };

    //提交数据
    submit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                console.log(values);
                console.log();
                const {name, desc, category, price} = values;
                const detail = this.richText.current.state.editorState.toHTML();
                let categoryId, pCategoryId;
                if (category.length === 1) {
                    //一级分类
                    categoryId = category[0];
                    pCategoryId = '0';
                } else {
                    //有两级分类
                    pCategoryId = category[0];
                    categoryId = category[1];
                }
                const {state} = this.props.location;
                let result = null, msg = '';

                if (state) {
                    result = await reqUpdateProduct({
                        name,
                        detail,
                        categoryId,
                        pCategoryId,
                        price,
                        desc,
                        _id: state._id
                    });
                    msg = '修改品类成功！';
                }
                else {
                    result = await reqAddProduct({name, detail, categoryId, pCategoryId, price, desc});
                    msg = '添加品类成功！';
                }


                if (result.status === 0) {
                    message.success(msg);
                    this.props.history.goBack();
                } else {
                    message.error(result.msg)
                }

            }
        })
    };

    componentDidMount() {
        this.getCategories('0');
        const {state} = this.props.location
        //p判断是否是更新产品
        if (state) {
            const {categoryId, pCategoryId} = state;
            if (pCategoryId === '0') {
                this.category = [categoryId];
            } else {
                //属于二级分类则需要请求二级分类数据
                this.getCategories(pCategoryId);
                this.category = [pCategoryId, categoryId];
                console.log(this.category)
            }
        }

    }

    render() {
        const {options} = this.state;
        const {form: {getFieldDecorator}, location: {state}} = this.props;
        return (
            <Card className='main'
                  title={<div className='top'>
                      <Icon className='arrow' onClick={this.goBack}
                            type='arrow-left'/><span>{state ? '修改商品' : '添加商品'}</span>
                  </div>}
            >
                <Form {...this.formItemLayout} onSubmit={this.submit}>
                    <Item label='商品名称'>
                        {
                            getFieldDecorator('name', {
                                rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: '名称不能为空或者出现空格'
                                }],
                                initialValue: state ? state.name : ''
                            })(<Input placeholder='请输入商品名称'/>)
                        }

                    </Item>
                    <Item label='商品描述'>
                        {
                            getFieldDecorator('desc', {
                                rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: '不能为空或者出现空格'
                                }],
                                initialValue: state ? state.desc : ''
                            })(<Input placeholder='请输入商品描述'/>)
                        }
                    </Item>
                    <Item label='所属分类'
                          wrapperCol={{
                              xs: {span: 24},
                              sm: {span: 5},
                          }}>
                        {
                            getFieldDecorator('category', {
                                rules: [{required: true, message: '分类不能为空'}],
                                initialValue: state ? this.category : []
                            })(<Cascader
                                options={options}
                                placeholder='请选择分类'
                                loadData={this.loadData}
                            />)
                        }
                    </Item>
                    <Item label='商品价格'>
                        {
                            getFieldDecorator('price', {
                                rules: [{required: true, message: '价格不能为空'}],
                                initialValue: state ? state.price : ''
                            })(<InputNumber
                                // 每3位数字就有一个，并且开头￥
                                formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                // 去除非数字的内容
                                parser={value => value.replace(/￥\s?|(,*)/g, '')}
                            >
                            </InputNumber>)
                        }
                    </Item>
                    {
                        state ? <Item label='商品图片'>
                            <PicturesWall _id={state._id} imgs={state.imgs?state.imgs:[]}/>
                        </Item> : null
                    }
                    <Item label='商品详情'
                          wrapperCol={{
                              xs: {span: 24},
                              sm: {span: 21},
                          }}>
                        <EditorDemo Txtcontent={state? state.detail:''} ref={this.richText}/>
                    </Item>
                    <Item wrapperCol={{
                        span: 12, offset: 2
                    }}>
                        <Button type='primary' htmlType="submit">提交</Button>
                    </Item>
                </Form>

            </Card>
        )
    }
}

export default SaveUpdate