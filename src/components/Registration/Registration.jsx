import { Button, DatePicker, Divider, Form, Input, Modal, message } from 'antd'
import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { accountService } from '../../services/AccountService'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { storageService } from '../../services/StorageService'

export const Registration = () => {
  const user = useSelector(state => state.user.data);
  const [open, setOpen] = useState(false);
  const adminModel = useRef();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [password,setPassword] = useState();

  const handleOk = async() => {
    setConfirmLoading(true);
    let result = await accountService.login(user.email, password)
    if (result.status === 200) {
      storageService.saveTokens(result.data.accessToken, result.data.refreshToken);
      result = await accountService.adminRegister(adminModel.current)
      if (result.status === 200) {
        message.success(`Адміністратор "${adminModel.current?.name} ${adminModel.current?.surname}" успішно зареєстрований`)
        navigate('/')
      }
    }
    setConfirmLoading(false);
    setOpen(false)
    setPassword('');
  };

  const handleCancel = () => {
    setOpen(false)
    setConfirmLoading(false);
    setPassword('');
  }


  const navigate = useNavigate()
  const onFinish = async (values) => {
    values.birthdate = new Date(values.birthdate).toISOString()
    if (user) {
      setOpen(true);
      adminModel.current = values;
      return;
    }
    const responce = await accountService.userRegister(values);
    if (responce.status === 200) {
      message.success(`Юзер "${values.name} ${values.surname}" успішно зареєстрований`)
      navigate('/')
    }
  }
  return (
    <>
      <Modal
        title="Введіть пароль адміністратора"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <>
          <Input.Password value={password} onChange={(e)=>setPassword(e.target.value)}/>
        </>
      </Modal>
      <Button shape="circle" onClick={() => window.history.back()} type="primary" icon={<ArrowLeftOutlined className='fs-4' />} />
      <div className='w-75 mx-auto'>
        <Divider className='fs-3  mb-5' orientation="left">Реєстрація {user ? '(Admin)' : ''}</Divider>
        <Form
          layout='vertical'
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          className=' mx-auto'
        >
          <Form.Item
            name="name"
            label="Ім'я"
            hasFeedback
            rules={[
              {
                pattern: '^[A-Z А-Я].*',
                message: "Ім'я повинно починатися з великої букви"
              },
              {
                required: true,
                message: "Введіть і'мя"
              },
            ]}
          >
            <Input placeholder="Ваше ім'я" showCount minLength={3} maxLength={100} />
          </Form.Item>
          <Form.Item
            name="surname"
            label="Прізвище"
            hasFeedback
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
            <Input placeholder="Ваше прізвище" showCount minLength={3} maxLength={100} />
          </Form.Item>
          <Form.Item
            name="birthdate"
            label="Дата народження"
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Оберіть дату народження'
              },
            ]}
          >
            <DatePicker placeholder="Дата народження" className='w-100' disabledDate={d => !d || d.isAfter(new Date(Date.now()))} />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Електронна пошта"
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
            <Input placeholder='Будьласка введіть пошту' />
          </Form.Item>

          <Form.Item

            label="Телефон"
            name="phoneNumbe"
            rules={[
              {
                pattern: '^\\d{3}[-\\s]{1}\\d{3}[-\\s]{1}\\d{2}[-\\s]{0,1}\\d{2}$',
                message: "Невірно введений телефон!(xxx-xxx-xx-xx) (xxx xxx xx xx) (xxx xxx xxxx) (xxx-xxx-xxxx)",
              },
            ]}
          >
            <Input placeholder='Ваш тедефон ' />
          </Form.Item>

          <Form.Item
            hasFeedback
            label="Пароль"
            name="password"
            rules={[
              {
                required: true,
                message: 'Будьласка введіть пароль!',
              },
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

            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Підтвердіть пароль"
            dependencies={['password']}
            name='confirmation'
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Будьласка підтвердіть ваш пароль!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Пароль підтвердження не співпадає з введенним паролем!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <div className='buttons-block'>
            <Button type="primary" htmlType="submit">
              {!user ? 'Зареэєструватися' : 'Зареєструвати'}
            </Button>
            {!user &&
              <Link to="/login">
                <Button >Увійти</Button>
              </Link>}
          </div>
        </Form>
      </div>
    </>
  )
}
