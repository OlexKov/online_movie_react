import React, { useEffect, useState } from 'react'
import { HomeOutlined, TableOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import { Menu as AntMenu,} from 'antd';
import { Link, useLocation } from 'react-router-dom';
import '../Menu/Menu.css'
import { userMethods } from '../../helpers/methods';
import { useSelector } from 'react-redux';


const items = [
    {
        key: "/home",
        icon:<HomeOutlined />,
        label:<Link className='link' to="/">Домашня сторінка</Link>,
        user: 'All'
    },
    {
        key: "/movietable",
        icon:<TableOutlined />,
        label:<Link  className='link' to="/movietable"><span>Фільми</span></Link>,
        user: 'Admin'
    },
    {
        key: "/staftable",
        icon:<UserOutlined /> ,
        label:<Link  className='link' to="/staftable"><span>Актори</span></Link>,
        user: 'Admin'
    },
    {
        key: "/about",
        icon:<UnorderedListOutlined />,
        label:<Link className='link' to="/about"><span>Про нас</span></Link>,
        user: 'All'
    }
]

export const Menu = () => {
    const user = useSelector(state=>state.user.data)
    const [menuItems,setMenuItems] = useState(items.filter(x=>x.user==='All'))
    const location = useLocation();
    const [current, setCurrent] = useState(
        location.pathname === "/" || location.pathname === ""
            ? "/home"
            : location.pathname,
    );
    useEffect(() => {
        if (location) {
            if( current !== location.pathname ) {
                setCurrent(location.pathname);
            }
        }
    }, [location, current]);

    useEffect(()=>{
       let itemArray = null; 
       if(!userMethods.isAuthenticated(user))
          itemArray = items.filter(x=> x.user==="All");
       else if(userMethods.isAdmin(user))
           itemArray = items.filter(x=>x.user==="All"  || x.user==="Admin")
       else if(userMethods.isUser(user))
           itemArray = items.filter(x=>x.user==="User" || x.user==="All")
         setMenuItems(itemArray)
    },[user]);

    function handleClick(e) {
        setCurrent(e.key);
    }
    return (
        <AntMenu
            onClick={handleClick}
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[current]}
            className='menu'
            items = { menuItems }
        />)
}
