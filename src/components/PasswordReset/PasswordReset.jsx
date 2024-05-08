import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, message } from 'antd';
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { accountService } from '../../services/AccountService';
import { useQuery } from '../../helpers/methods';




export const PasswordReset = () => {
    const params = useQuery()
    const email = params.get('email');
    const token = params.get('token').replaceAll(' ', '+')
    const navigate = useNavigate()
    const onFinish = async (values) => {
        const responce = await accountService.reset(email, token, values.password);
        if (responce.status === 200) {
            navigate('/')
            message.success('Пароль успішно змінено...')
        }
    }
    return (
        <>
            <Button shape="circle" onClick={() => window.history.back()} type="primary" icon={<ArrowLeftOutlined className='fs-4' />} />
            <div className='w-75 mx-auto'>
                <Divider className='fs-3  mb-5' orientation="left">Зміна раролю</Divider>
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
                    className=' mx-auto'
                >


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
                    <Button type="primary" htmlType="submit">Змінити</Button>
                </Form>
            </div>
        </>
    )
}
