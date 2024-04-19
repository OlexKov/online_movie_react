import React from 'react'
import { Menu } from '../Menu/Menu'
import '../Header/Header.css'
import { Link } from 'react-router-dom'
import { HeartOutlined, LoginOutlined } from '@ant-design/icons'
import logo from '../../logo.png';
import { Tooltip } from 'antd'


export const Header = () => {
    return (
        <>
            <img className='logo' src={logo} alt='' />
            <h3 className='title'>Online movie</h3>
            <Menu />
            <div className='d-flex gap-4'>
                <Tooltip placement="bottom" title="Улюблені">
                    <Link to="favourite">
                        <HeartOutlined className="fs-4" />
                    </Link>
                </Tooltip>
                <Tooltip placement="bottom" title="Вхід / Реєстрація">
                    <Link to="login">
                        <LoginOutlined className="fs-4" />
                    </Link>
                </Tooltip>
            </div>
        </>
    )
}
