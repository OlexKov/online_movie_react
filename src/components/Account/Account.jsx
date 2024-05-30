import { ArrowLeftOutlined, EditOutlined, LockOutlined, YoutubeOutlined } from '@ant-design/icons'
import { Button, DatePicker, Divider, Form, Input, Popconfirm, Space, Switch, Tag, message, } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import '../Account/Account.css'
import { dateFormat } from '../../helpers/constants'
import dayjs from 'dayjs';
import { accountService } from '../../services/AccountService'
import { storageService } from '../../services/StorageService'
import { clearUserData, setUserData } from '../store/userDataSlice'

export const Account = () => {
  const user = useSelector(state => state.user.data)
  const [userPrtemium,setUserPremium]  = useState(null)
  const [formDisable, setFormDisable] = useState(true)
  const dispatcher = useDispatch()
  const [form] = Form.useForm();
  
  const editModeChange = (mode) => {
    setFormDisable(mode)
    if (mode)
      setFormValues()
  }

  useEffect(() => {
    (async()=>{
      const result = await accountService.getPremium(user.email)
      if(result.status===200){
        setUserPremium(result.data)
      }
    })()
    setFormValues()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])


  const setFormValues = () => {
    form.resetFields();
    form.setFieldsValue({
      birthdate:dayjs(user.dateOfBirth.split('.').reverse().join('-'), dateFormat), 
      oldPassword: null,
      password: null
    });
  }
  const isChange = (formResult,user) =>{
    return  formResult.name !== user.name
          || formResult.surname !== user.surname
          || formResult.email !== user.email
          || formResult.phoneNumber !== user.phoneNumber
          || new Date(formResult.birthdate).toLocaleDateString()!== user.dateOfBirth
          || formResult.password?.length !== 0

  }
  const onFinish = async(formResult) => { 
    if(isChange(formResult,user)){
      const formData = new FormData();
      Object.keys(formResult).forEach((key)=>{
        if(key==='birthdate')
          formData.append(key,new Date(formResult[key]).toLocaleDateString())
        formData.append(key,formResult[key])
      })
      formData.append('id',user.id);
      const result = await accountService.editUser(formData);
      if(result.status === 200){
        if(storageService.isSessionStorage()){
           storageService.setTemporalyTokens(result.data,storageService.getRefreshToken())
        }
        else{
          storageService.saveTokens(result.data,storageService.getRefreshToken());
        }
        dispatcher(setUserData({token:result.data}))
        setFormDisable(true)
        message.success('Дані користувача успішно змінені')
      }
    }
   }

   const deleteAccount = async()=>{
       const result = await accountService.deleteAccount(user.email);
       if(result.status === 200){
          dispatcher(clearUserData())
       }
   }

  return (
    <>
      <Button shape="circle" onClick={() => window.history.back()} type="primary" icon={<ArrowLeftOutlined className='fs-4' />} />
      <div className='w-75 mx-auto'>

        <Divider className='fs-3  mb-5' orientation="left">{user.name} {user.surname} {user.isAdmin ? '(Admin)' : ''}</Divider>
        <div style={{ maxWidth: 600 }} className='d-flex justify-content-between gap-3 mx-auto py-4'>
        <Popconfirm
            title="Видалення акаута !!!"
            description={`Ви впевненні що бажаєте видалити свій акаунт ?`}
            onConfirm={deleteAccount}
            okText="Так"
            cancelText="Ні"
          >
           <Button style={{width:'auto'}}  danger type="primary" >Видалити акаунт</Button>
          </Popconfirm>
          <Switch style={{ width: 60 }} value={formDisable} onChange={editModeChange} checkedChildren={<EditOutlined className='fs-6'/>} unCheckedChildren={<LockOutlined className='fs-6' />} />
        </div>

        <Form
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            ...user
          }}
          onFinish={onFinish}
          className='d-flex flex-column mx-auto'
          disabled={formDisable}
          form={form}
        >

          {!user.isAdmin &&
            <>
              <hr />
              <div style={{marginBottom:25}} className='input-container'>
                <span>Підписка</span>
                <Tag className=' fs-6 py-1 px-2 mx-5 ' icon={<YoutubeOutlined />} color="green">{userPrtemium?.name}</Tag>
              </div>
            </>}
          <hr />
          <div className='input-container'>
            <span>Ім'я</span>
            <Form.Item
              name="name"
              rules={[
                {
                  pattern: '^[A-Z А-Я].*',
                  message: "Ім'я повинно починатися з великої букви"
                },
                {
                  required: true,
                  message: "Введіть ім'я"
                },
              ]}
            >
              <Input placeholder="Ваше ім'я" variant="borderless" />
            </Form.Item>
          </div>
          <hr />

          <div className='input-container'>
            <span>Прізвище</span>
            <Form.Item
              name="surname"
              rules={[
                {
                  pattern: '^[A-Z А-Я].*',
                  message: "Прізвище повинно починатися з великої букви"
                },
                {
                  required: true,
                  message: 'Ведіть прізвище'
                },
              ]}
            >

              <Input placeholder="Ваше прізвище" variant="borderless" />

            </Form.Item>
          </div>
          <hr />
          <div className='input-container'>
            <span>Дата народження</span>
            <Form.Item
              name="birthdate"
              className='p-0 m-0'
              rules={[
                {
                  required: true,
                  message: 'Оберіть дату народження'
                },
              ]}>
              <DatePicker style={{ width: 300, marginBottom: 25 }} placeholder="Дата народження" variant="borderless" disabledDate={d => !d || d.isAfter(new Date(Date.now()))} />

            </Form.Item>
          </div>
          <hr />

          <div className='input-container'>
            <span>Електронна пошта</span>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Будьласка введіть пошту!",
                },
                {
                  type: 'email',
                  message: "Невірно введена пошта!",
                },
              ]}
            >
             <Input variant="borderless" placeholder='Будьласка введіть пошту' />
           </Form.Item>
          </div>
          <hr />

          <div className='input-container'>
            <span>Телефон</span>
            <Form.Item
              name="phoneNumber"
              rules={[
                {
                  pattern: '^\\d{3}[-\\s]{1}\\d{3}[-\\s]{1}\\d{2}[-\\s]{0,1}\\d{2}$',
                  message: "Невірно введений телефон!",
                },
              ]}
            >
              <Input variant="borderless" placeholder='Ваш телефон ' />
            </Form.Item>
          </div>
          <hr />
          {!formDisable &&
            <>
              <Form.Item
                name='newPassword'
                className='flex-fill'
                rules={[
                  {
                    pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?([^\\w\\s]|[_])).{6,}$',
                    message: 'Невірний пароль...!',
                  },
                  {
                    min: 6,
                    message: 'Пароль має містити не менше 6 символів!',
                  },
                  {
                    max: 16,
                    message: 'Пароль має містити не більше 16 символів!',
                  }
                ]}
              >
                <div className='input-container'>
                  <span>Новий пароль</span>
                  <Input.Password style={{ width: 300 }} variant="borderless" placeholder='Новий пароль' />
                </div>

              </Form.Item>
              <hr />
              <Form.Item
                name="password"
                className='flex-fill'
                dependencies={['newPassword']}
                rules={[
                  {
                    pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?([^\\w\\s]|[_])).{6,}$',
                    message: 'Невірний пароль...!',
                  },
                  {
                    min: 6,
                    message: 'Пароль має містити не менше 6 символів!',
                  },
                  {
                    max: 16,
                    message: 'Пароль має містити не більше 16 символів!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (getFieldValue('newPassword') && !value) {
                        return Promise.reject(new Error('Введіть старий пароль!'));
                      }
                      else
                        return Promise.resolve();
                    },
                  }),

                ]}
              >
                <div className='input-container'>
                  <span>Старий пароль</span>
                  <Input.Password style={{ width: 300 }} variant="borderless" placeholder='Старий пароль' />
                </div>
              </Form.Item>
              <hr />
              <Form.Item className=' align-self-end'>
                <Space>
                  <Button style={{ width: 200 }} type="primary" htmlType="submit">
                    Зберегти
                  </Button>
                  <Button style={{ width: 200 }} htmlType="button" onClick={setFormValues}>
                    Відмінити зміни
                  </Button>
                </Space>
              </Form.Item>
            </>}


        </Form>
      </div>

    </>
  )
}
