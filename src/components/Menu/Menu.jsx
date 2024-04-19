import React, { useEffect, useState } from 'react'
import { HomeOutlined, TableOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Menu as AntMenu,} from 'antd';
import { Link, useLocation } from 'react-router-dom';
import '../Menu/Menu.css'

const menuItems = [
    {
        key: "/home",
        icon:<HomeOutlined />,
        label:<Link className='link' to="/">Домашня сторінка</Link>
    },
    {
        key: "/about",
        icon:<UnorderedListOutlined />,
        label:<Link className='link' to="/about"><span>Про нас</span></Link>
    },
    {
        key: "/movietable",
        icon:<TableOutlined />,
        label:<Link  className='link' to="/movietable"><span>Фільми</span></Link>
    }

]

export const Menu = () => {
    let location = useLocation();
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
            items = {menuItems}
        />)
}
