
import { Menu } from '../Menu/Menu'
import '../Header/Header.css'
import { Link, useNavigate } from 'react-router-dom'
import { AndroidOutlined, HeartOutlined, LoginOutlined, LogoutOutlined, MoonFilled,  SunFilled, UserOutlined } from '@ant-design/icons'
import logo from '../../logo.png';
import { Button, Dropdown, Switch, Tooltip } from 'antd'
import { useSelector } from 'react-redux'
import { useDispatch } from "react-redux";
import { clearUserData } from '../store/userDataSlice';
import { accountService } from '../../services/AccountService';
import { storageService } from '../../services/StorageService';
import { userMethods } from '../../helpers/methods';
import { swithTheme } from '../store/themeSlice';



export const Header = () => {
    const user = useSelector(state => state.user.data)
    const dispather = useDispatch();
    const navigate = useNavigate()
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
            label: <Link to="">
                <Button  type="link">Мій акаунт</Button>
            </Link>,
            key: '0',
            icon: <UserOutlined />
        },
        {
            label: <Button onClick={logout} type="link">Вийти</Button>,
            key: '1',
            icon: <LogoutOutlined />
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
               {/* {!userMethods.isAdmin(user) && <Tooltip placement="bottom" title="Улюблені">
                    <Link to="favourite">
                        <HeartOutlined className="fs-4 fw-bold" />
                    </Link>
                </Tooltip>} */}
                {(!user && <Tooltip placement="bottom" title="Вхід / Реєстрація">
                    <Link to="login">
                        <LoginOutlined className="fs-4 fw-bold" />
                    </Link>
                </Tooltip>) ||
                    <Dropdown
                        menu={{ items }}
                        trigger={['click']}
                    >
                        <div className='user-view'>
                           {(userMethods.isAdmin(user) && <AndroidOutlined className=' text-danger'/>)
                             || <UserOutlined className=' text-success'/> }
                            <span className='text-white fw-light fs-6 fst-italic'> {user?.name} {user?.surname}</span>
                        </div>

                    </Dropdown>
                }
                <Switch 
                   style={{width:50}} 
                   onChange={onThemeChange}
                   checkedChildren={<SunFilled/>}
                   unCheckedChildren={<MoonFilled/>}
                   
                   checked={storageService.isDarkTheme()}/>
                  
            </div>
        </>
    )
}
