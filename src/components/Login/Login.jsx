import React from 'react';
import { Button, Checkbox, Divider, Form, Input } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

import { Link, useNavigate } from 'react-router-dom';
import '../Login/Login.css'
import { accountService } from '../../services/AccountService';
import { useDispatch } from "react-redux";
import { setUserData } from '../store/userDataSlice'; 
import { storangeService } from '../../services/StorangeService';




export const Login = () => {
  const dispather = useDispatch();
  const navigate = useNavigate()
   const onFinish = async (values) => {
    const responce = await accountService.login(values.email,values.password);
    if(responce.status === 200){
     if(values.remember)
       storangeService.saveTokens(responce.data.accessToken,responce.data.refreshToken);
     else storangeService.setTemporalyTokens(responce.data.accessToken,responce.data.refreshToken)
     dispather(setUserData({token:responce.data.accessToken}))
     navigate('/')
    }
 }
  return (
    <>
      <Button shape="circle" onClick={() => window.history.back()} type="primary" icon={<ArrowLeftOutlined className='fs-4' />} />
      <div className='w-75 mx-auto'>
        <Divider className='fs-3  mb-5 text-black-50' orientation="left">Логін</Divider>
        <Form
          layout='vertical'
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        //  onFinishFailed={onFinishFailed}
          autoComplete="off"
          className=' mx-auto'
        >
          <Form.Item
            label="Електронна пошта"
            name="email"
            rules={[
              {
                required: true,
                message: "Будьласка введіть логін!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[
              {
                required: true,
                message: 'Будьласка введіть пароль!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"

          >
            <Checkbox>Запам'ятати мене</Checkbox>
          </Form.Item>
          <div className='buttons-block'>
            <Button type="primary" htmlType="submit">
              Увійти
            </Button>
            <Link to="/registration">
              <Button >Реєстрація</Button>
            </Link>
            <Link to='/fogotpassword'>Забули раполь?</Link>
          </div>
        </Form>
      </div>

    </>

  )
}
