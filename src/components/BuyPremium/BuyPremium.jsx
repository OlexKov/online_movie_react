import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { dataService } from '../../services/DataService'
import { PremiumCard } from '../PremiumCard/PremiumCard'
import { Button, Divider } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { accountService } from '../../services/AccountService'
import axios from 'axios'

export const BuyPremium = () => {
  const user = useSelector(state=>state.user.data)
  const [premiums,setPremiums] = useState([])
  const [userPremium,setUserPremium] = useState(1);
  useEffect(()=>{
    (async()=>{

      await axios.all(
        [
           dataService.getPremiums(),
           accountService.getPremium(user.email)
        ])
        .then(axios.spread(async (...res) => {
          setPremiums([...res[0].data.slice(1)])
          setUserPremium(res[1].data.id)
        }));
    })()
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return (
    <>
            <Button shape="circle" onClick={() => window.history.back()} type="primary" icon={<ArrowLeftOutlined className='fs-4' />} />
            <div className='w-75 mx-auto'>
                <Divider className='fs-3  mb-5' orientation="left">Оберіть свою підписку</Divider>
                 <div className='d-flex justify-content-center flex-wrap gap-5'>
                    {premiums.map(x=><PremiumCard current={x.id === userPremium} {...x}/>)}
                </div>
                
            </div>
        </>
    
     
   
  )
}
