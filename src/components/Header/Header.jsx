import React from 'react'
import { Menu } from '../Menu/Menu'
import '../Header/Header.css'


export const Header = () => {
    return (
        <>
            <h2 className='title'>Online movie</h2>
            <Menu />
        </>
    )
}
