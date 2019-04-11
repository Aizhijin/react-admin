import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Form, Input, Tree} from 'antd';
import menulist from '../../config/menu-config'

const Item = Form.Item;
const {TreeNode} = Tree;

@Form.create()
class UpdateRoleForm extends Component {
    static propTypes = {
        role: PropTypes.object.isRequired,
        updateRoles: PropTypes.func.isRequired
    };
    //选中
    onCheck = (checkedKeys) => {
        const arr = checkedKeys.filter((item) => {
            return item !== '-1';
        });
        this.props.updateRoles(arr);
    };

    renderTreeNodes = data => data.map((item) => {
        if (item.children) {
            return (
                <TreeNode title={item.title} key={item.key} dataRef={item}>
                    {
                        this.renderTreeNodes(item.children)
                    }
                </TreeNode>
            );
        }
        return <TreeNode {...item} />;
    });

    render() {
        const {form: {getFieldDecorator}, role: {name, menus}} = this.props;
        return (
            <Form>
                <Item label='角色名称'>
                    {
                        getFieldDecorator(
                            'name',
                            {
                                initialValue: name
                            }
                        )(
                            <Input placeholder='请输入角色名称' disabled/>
                        )
                    }
                </Item>
                <Item>
                    <Tree
                        checkable
                        onCheck={this.onCheck}
                        checkedKeys={menus}
                        defaultExpandAll>
                        <TreeNode title='平台权限' key='-1'>
                            {this.renderTreeNodes(menulist)}
                        </TreeNode>
                    </Tree>
                </Item>
            </Form>
        )
    }
}

export default UpdateRoleForm