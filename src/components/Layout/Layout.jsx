import React from 'react'
import { Layout as AntLayout, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import { Header  } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import '../Layout/Layout.css'
const { Content ,Header:AntHeader,Footer:AntFooter} = AntLayout;
export const Layout = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
     return (
        <AntLayout>
            <AntHeader className='header'>
                <Header/>
            </AntHeader>
            <Content className='content'>
                <div style={{background: colorBgContainer, borderRadius: borderRadiusLG }}>
                    <Outlet />
                </div>
            </Content>
            <AntFooter className='footer'>
                <Footer/>
            </AntFooter>
        </AntLayout>
    )
}
