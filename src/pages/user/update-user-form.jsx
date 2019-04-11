import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Select } from 'antd';

const Item = Form.Item;
const Option = Select.Option;

@Form.create()
class UpdateUserForm extends Component {
    static propTypes={
        user:PropTypes.object.isRequired,
        roles:PropTypes.array.isRequired
    };
  render () {
    const { form:{getFieldDecorator },user,roles} = this.props;
    const {username,phone,email,role_id}=user;
    console.log(role_id);
    return (
      <Form>
        <Item label='用户名' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'username',
              {initialValue: username}
            )(
              <Input placeholder='请输入用户名'/>
            )
          }
        </Item>
        <Item label='手机号' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'phone',
              {initialValue: phone}
            )(
              <Input placeholder='请输入手机号'/>
            )
          }
        </Item>
        <Item label='邮箱' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'email',
              {initialValue:email}
            )(
              <Input placeholder='请输入邮箱'/>
            )
          }
        </Item>
        <Item label='角色' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'role_id',{
                    initialValue: role_id
                }
            )(
              <Select placeholder='请选择分类' >
                  {
                      roles.map((role)=><Option key={role._id} value={role._id}>{role.name}</Option>)
                  }
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default UpdateUserForm;