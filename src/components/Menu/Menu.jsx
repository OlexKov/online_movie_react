import React from 'react'
import { HomeOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Menu as AntMenu,} from 'antd';
import { Link } from 'react-router-dom';

export const Menu = () => {
    return (
        <AntMenu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{
                flex: 1,
                minWidth: 0,
            }}
        >
            <AntMenu.Item key="1">
                <HomeOutlined />
                <span>Home</span>
                <Link to="/" />
            </AntMenu.Item>
           
            <AntMenu.Item key="3">
                <UnorderedListOutlined />
                <span>About</span>
                <Link to="about" />
            </AntMenu.Item>
        </AntMenu>
    )
}
