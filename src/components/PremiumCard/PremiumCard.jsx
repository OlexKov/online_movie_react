import React from 'react'
import '../PremiumCard/PremiumCard.css'
import { Badge, Button } from 'antd'

export const PremiumCard = ({id,name,current,price,onSelect}) => {
  const cardContent = (
    <div className='premium-card-content text-center'>
     <h2>{name}</h2> 
     <hr/>
     <div className=' rounded-5 bg-success border p-3 pb-5'>
         <h3>{price} грн.</h3>
         <h5 style={{fontStyle:'italic'}}>30 днів</h5>
     </div>
     {!current && <Button className='chooseButton' onClick={()=>onPremiumSelect(id)} type='primary'>Обрати</Button>}
    </div>
  );
  const onPremiumSelect = async (premiumId)=>{
      await onSelect(premiumId)
  }
  return (
    <div className='premium-card-container'>
           { current? <Badge.Ribbon style={{fontStyle:'italic'}} text={'Поточна підписка'} color="cyan-3">{cardContent}</Badge.Ribbon>
           : cardContent}
               
    </div>
  )
}
