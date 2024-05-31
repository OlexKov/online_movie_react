import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { dataService } from '../../services/DataService'
import { PremiumCard } from '../PremiumCard/PremiumCard'
import { Button, Divider, Spin, message } from 'antd'
import { ArrowLeftOutlined, SmileOutlined } from '@ant-design/icons'
import { accountService } from '../../services/AccountService'
import axios from 'axios'
import { CreditCardInfo } from '../CreditCardInfo/CreditCard'
import { useNavigate } from 'react-router-dom'
import { storageService } from '../../services/StorageService'
import { setUserData } from '../store/userDataSlice'



export const BuyPremium = () => {
  const user = useSelector(state => state.user.data)
  const navigator = useNavigate();
  const [premiums, setPremiums] = useState([])
  const [userPremium, setUserPremium] = useState(1);
  const [selectedPremium, setSelectedPremium] = useState(null);
  const [title, setTitle] = useState('Оберіть підписку');
  const [loading, setLoading] = useState(false)
  const dispatcher = useDispatch()
  useEffect(() => {
    (async () => {

      await axios.all(
        [
          dataService.getPremiums(),
          accountService.getPremium(user.email)
        ])
        .then(axios.spread(async (...res) => {
          setPremiums([...res[0].data.slice(1)])
          setUserPremium(res[1].data)
        }));
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onPremiumSelect = (id) => {
    if (id !== userPremium.id) {
      const prem = premiums.find(x => x.id === id);
      setTitle(`Оплата за підписку "${prem.name}"`)
      setSelectedPremium(prem)
    }
  }
  
  const onFinish = async (formValue) => {
    setLoading(true);
    const result = await accountService.setUserPremium(user.email, selectedPremium.id, 30);
    if (result.status === 200) {
      storageService.saveTokens(result.data, storageService.getRefreshToken());
      dispatcher(setUserData({ token: result.data }))
      await new Promise(r => setTimeout(r, 2000));
      message.success(`Ваша підписка змінена з "${userPremium?.name.toUpperCase()}" на "${selectedPremium?.name.toUpperCase()}"`, 3);
      navigator('/')
    }
    setLoading(false);
  }

  return (
    <>
      <Spin spinning={loading} delay={500} fullscreen size='large' />
      <Button shape="circle" onClick={() => { !selectedPremium ? window.history.back() : setSelectedPremium(null) }} type="primary" icon={<ArrowLeftOutlined className='fs-4' />} />
      <div className='w-75 mx-auto'>
        <Divider className='fs-3  mb-5' orientation="left">{title}</Divider>
        {!selectedPremium
          ? <div className='d-flex justify-content-center flex-wrap gap-5'>
            {premiums.map(x => <PremiumCard current={x.id === userPremium?.id} onSelect={onPremiumSelect} {...x} />)}
          </div>
          : <div className='d-flex flex-column gap-5 align-items-center'>
            <div className='d-flex flex-column gap-3 text-center border rounded-4 p-3'>
              <h4>Підписка "{selectedPremium.name}" дає змогу переглядати фільми рівня "{selectedPremium.name}"</h4>
              {userPremium.id !== 1 &&
                <div className='border rounded-3 bg-danger p-3'>
                  <h4>Увавага !!! </h4>
                  <h5>При переході на підписку "{selectedPremium.name}" ваша поточна підписка "{userPremium.name}" буде онульована ! ! !"</h5>
                </div>}
              <h3>Вартість підписки {selectedPremium.price}грн.</h3>
              <h5 className=' text-primary'>Заповніть реквізити для оплати та натисніть "Сплатити"</h5>
              <h5 className=' text-primary'>Приємного перегляду <SmileOutlined /></h5>
            </div>
            <CreditCardInfo onFinish={onFinish} className='mx-auto' />
          </div>}
      </div>
    </>



  )
}
