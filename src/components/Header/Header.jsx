
import { Menu } from '../Menu/Menu'
import '../Header/Header.css'
import { Link, useNavigate } from 'react-router-dom'
import { BugOutlined, LoginOutlined, LogoutOutlined, MoonFilled, SunFilled, UserAddOutlined, UserOutlined } from '@ant-design/icons'
import logo from '../../logo.png';
import { Button, Dropdown, Switch, Tooltip } from 'antd'
import { useSelector } from 'react-redux'
import { useDispatch } from "react-redux";
import { clearUserData, swithTheme } from '../store/userDataSlice';
import { accountService } from '../../services/AccountService';
import { storageService } from '../../services/StorageService';
import { useEffect, useState } from 'react';




export const Header = () => {
    const user = useSelector(state => state.user.data)
    const dispather = useDispatch();
    const navigate = useNavigate()
    const [userMenuItems, setUserMenuItems] = useState([])

    useEffect(() => {
        if (user?.isAdmin)
            setUserMenuItems(items.filter(x => x.users.includes('Admin')))
        else if (user?.isUser)
            setUserMenuItems(items.filter(x => x.users.includes('User')))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    const logout = async () => {
        const responce = await accountService.logout(storageService.getRefreshToken());
        if (responce?.status === 200) {
            storageService.removeTokens();
            dispather(clearUserData())
            navigate('/')
        }
    }
    const items = [
        {
            label: <Link to="account">
                <Button type="link">Мій акаунт</Button>
            </Link>,
            key: '0',
            icon: <UserOutlined className='fs-6' />,
            users: ['User', 'Admin']
        },
        {
            label: <Link to="registration">
                <Button onClick={null} type="link">Hовий адмін</Button>
            </Link>,
            key: '1',
            icon: <UserAddOutlined className='fs-6' />,
            users: ['Admin']
        },
        {
            label: <Button onClick={logout} type="link">Вийти</Button>,
            key: '2',
            icon: <LogoutOutlined className='fs-6' />,
            users: ['User', 'Admin']
        }
    ]

    const onThemeChange = () => {
        dispather(swithTheme())
    };
    return (
        <>
            <img className='logo' src={logo} alt='' />
            <h3 className='header-title'>Online movie</h3>
            <Menu />
            <div className='d-flex gap-4  align-items-center'>
                {(!user && <Tooltip placement="bottom" title="Вхід / Реєстрація">
                    <Link to="login" style={{ textDecoration: 'none' }} className='d-flex gap-2'>
                        <LoginOutlined className="fs-4 fw-bold" />
                        <span style={{ fontSize: 16 }}>Увійти</span>
                    </Link>
                </Tooltip>) ||
                    <Dropdown
                        menu={{ items: userMenuItems }}
                        trigger={['click']}
                    >
                        <div className='user-view'>
                            {(user?.isAdmin && <BugOutlined className=' text-danger' />)
                                || <UserOutlined className=' text-success' />}
                            <span className='text-white fw-light fs-6 fst-italic'> {user?.name} {user?.surname}</span>
                        </div>

                    </Dropdown>
                }
                <Switch
                    style={{ width: 50 }}
                    onChange={onThemeChange}
                    checkedChildren={<SunFilled />}
                    unCheckedChildren={<MoonFilled />}
                    checked={storageService.isDarkTheme()} />
            </div>
        </>
    )
}
