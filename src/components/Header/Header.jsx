
import { Menu } from '../Menu/Menu'
import '../Header/Header.css'
import { Link, useNavigate } from 'react-router-dom'
import { HeartOutlined, LoginOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import logo from '../../logo.png';
import { Dropdown, Tooltip } from 'antd'
import { useSelector } from 'react-redux'
import { useDispatch } from "react-redux";
import { clearUserData } from '../store/userDataSlice';
import { accountService } from '../../services/AccountService';
import { storageService } from '../../services/StorageService';


export const Header = () => {
    const user = useSelector(state => state.user.data)
    const dispather = useDispatch();
    const navigate = useNavigate()
    const logout =  async() => {
        console.log('logout')
        const responce = await accountService.logout(storageService.getRefreshToken());
        if(responce?.status === 200){
            storageService.removeTokens();
            dispather(clearUserData())
            navigate('/')
        }
    }
    const items = [
        {
            label: <Link to="">
                Мій акаунт
            </Link>,
            key: '0',
            icon: <UserOutlined />
        },
        {
            label: <span onClick={logout}>Вийти</span>,
            key: '1',
            icon: <LogoutOutlined />
        }
    ]


    return (
        <>
            <img className='logo' src={logo} alt='' />
            <h3 className='title'>Online movie</h3>
            <Menu />
            <div className='d-flex gap-4 align-items-center'>
                <Tooltip placement="bottom" title="Улюблені">
                    <Link to="favourite">
                        <HeartOutlined className="fs-4 fw-bold" />
                    </Link>
                </Tooltip>
                {(!user && <Tooltip placement="bottom" title="Вхід / Реєстрація">
                    <Link to="login">
                        <LoginOutlined className="fs-4 fw-bold" />
                    </Link>
                </Tooltip>) ||
                    <Dropdown
                        menu={{ items }}
                        trigger={['click']}
                    >
                        <UserOutlined className="fs-4 fw-bold text-primary"></UserOutlined>
                    </Dropdown>
                }
                <h6 className=' text-white-50'> {user?.name} {user?.surname}</h6>
            </div>
        </>
    )
}
