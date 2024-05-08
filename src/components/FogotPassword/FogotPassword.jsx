import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Divider, Form, Input } from 'antd'
import React, { useState } from 'react'
import { accountService } from '../../services/AccountService'


const FogotPassword = () => {
  const [sendSuccess,setSendSuccess] = useState(false) ;
  const onFinish = async (values) => {
   
  const responce = await accountService.fogot(values.email,window.location.origin.toString() + "/" + process.env.REACT_APP_PASSWORD_RESET_PAGE);
  setSendSuccess(responce.status === 200)
  }
   
     
  return (
    <>
       <Button shape="circle" onClick={() => window.history.back()} type="primary" icon={<ArrowLeftOutlined className='fs-4' />} />
        <div className='w-75 mx-auto text-center'> 
       {(!sendSuccess && 
       <>
        <Divider className='fs-3  mb-5' orientation="left">Забули пароль</Divider>
        <Form
          layout='vertical'
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="off"
          className='mx-auto'
        >
          <Form.Item
            label="Електронна пошта"
            name="email"
            rules={[
              {
                required: true,
                message: "Будьласка введіть логін!",
              },
              {
                type: 'email',
                message: "Невірно введена пошта!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          
            <Button type="primary" htmlType="submit">
              Відправити
            </Button>
        </Form>
        </>
      ) ||  <p>Перевірте електронну скриньку та дійте відповідно інструкцій листа...</p>}
      </div> 
      
     
    </>
  )
}

export default FogotPassword