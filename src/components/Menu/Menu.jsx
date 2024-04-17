import React from 'react'
import { HomeOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Menu as AntMenu,} from 'antd';
import { Link } from 'react-router-dom';
import '../Menu/Menu.css'

export const Menu = () => {
    return (
        <AntMenu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
           className='menu'
        >
            <AntMenu.Item key="1">
                <HomeOutlined />
                <span>Домашня сторінка</span>
                <Link to="/" />
            </AntMenu.Item>
           
            <AntMenu.Item key="2">
                <UnorderedListOutlined />
                <span>Про нас</span>
                <Link to="about" />
            </AntMenu.Item>
        </AntMenu>
    )
}
