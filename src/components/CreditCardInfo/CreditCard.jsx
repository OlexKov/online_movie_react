import { Button, Form, Input } from 'antd';
import React, { useState } from 'react'
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

export const CreditCardInfo = ({onFinish}) => {
  const [state, setState] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    focus: '',
  });
  const [form] = Form.useForm();
  const handleInputChange = (evt) => {
    const { name, value } = evt.target;
    let formatedValue = value;
    if (name === 'number')
      formatedValue = formatCardNumber(value)
    else if (name === 'expiry') {
      formatedValue = formatDate(value)
    } else if (name === 'cvc') {
      formatedValue = formatCVC(value)
    }
    setState((prev) => ({ ...prev, [name]: formatedValue }));
  }

  const handleInputFocus = (evt) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  }

  const formatCardNumber = (number) => {
    if (state.number.length > number.length) return number;
    const lastChar = number.slice(-1);
    if (lastChar !== ' ' && isNaN(Number(lastChar))) {
      number = number.substring(0, number.length - 1);
    }
    else if (lastChar !== ' ' && (number.length === 4 || number.length === 9 || number.length === 14)) {
      number += ' '
    }
    form.setFieldValue('number', number)
    return number;
  };

 
  const formatDate = (expiry) => {
    if (state.expiry.length > expiry.length) return expiry;
    const lastChar = expiry.slice(-1);
    if (lastChar===' ' || isNaN(Number(lastChar)) || (expiry.length===2 && Number(expiry)>12)) {
      expiry = expiry.substring(0, expiry.length - 1);
    }
    if (expiry.length === 3 && lastChar !== '/') {
      expiry = expiry.substring(0, expiry.length - 1) + '/' + lastChar;
    }
    form.setFieldValue('expiry', expiry)
    return expiry;
  };

  const formatCVC = (cvc) => {
    const lastChar = cvc.slice(-1);
    if (lastChar === ' ' || isNaN(cvc.slice(-1))) {
      cvc = cvc.substring(0, cvc.length - 1);
    }
    form.setFieldValue('cvc', cvc)
    return cvc;
  };

  return (
    <div  style={{minWidth:280}} className='d-flex flex-column gap-4 w-30' >
      <Cards
        number={state.number}
        expiry={state.expiry}
        cvc={state.cvc}
        name={state.name}
        focused={state.focus}
        placeholders={
          {
            name: "ім'я та прізвище",
          }}
          locale = {{
            valid: "exp date",
          }}
      />
      <Form form={form} layout='vertical' onFinish={onFinish} className='align-self-center text-center'>
        <Form.Item
          name="number"
          label="Номер картки"
          placeholder='Введіть номер картки'
          rules={[
            {
                required: true,
                message: "Введіть номер картки"
            }]}>
          <Input
            name="number"
            minLength={19}
            maxLength={19}
            value={state.number}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
        </Form.Item>
        <Form.Item
          name="name"
          label="Ім'я та прізвище"
          placeholder="Введіть ваше ім'я та прізвище"
          rules={[
            {
                required: true,
                message: "Введіть ваше ім'я та прізвище"
            }]}>
          <Input
            name="name"
            minLength={5}
            maxLength={256}
            value={state.name}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
        </Form.Item>
        <div className='d-flex gap-4 justify-content-between'>
          <Form.Item
            name="expiry"
            label="Дата"
            placeholder="Введіть дату"
            className='flex-fill'
            rules={[
              {
                  required: true,
                  message: "Введіть дату"
              }]}>
            <Input
              name="expiry"
              minLength={5}
              maxLength={5}
              value={state.expiry}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </Form.Item>

          <Form.Item
            name="cvc"
            label="СVС код"
            placeholder="Введіть СVС код"
            className='flex-fill'
            rules={[
              {
                  required: true,
                  message: "Введіть СVС код"
              }]}>
            <Input
            type='password'
              name="cvc"
              minLength={3}
              maxLength={3}
              value={state.cvc}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </Form.Item>
        </div>
        <Button  htmlType="submit" type='primary'>Cплатити</Button>
      </Form>
    </div>

  )
}


