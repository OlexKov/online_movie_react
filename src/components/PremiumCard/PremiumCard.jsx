import React from 'react'
import '../PremiumCard/PremiumCard.css'
import { Badge, Button } from 'antd'
import { useNavigate } from 'react-router-dom'

export const PremiumCard = ({id,name,rate,current,price}) => {
  const navigator = useNavigate()
  const cardContent = (
    <div className='premium-card-content text-center'>
     <h2>{name}</h2> 
     <hr/>
     <div className=' rounded-5 bg-success border p-3 pb-5'>
         <h3>{price} грн.</h3>
         <h5 style={{fontStyle:'italic'}}>30 днів</h5>
     </div>
     <Button className='chooseButton' type='primary'>Обрати</Button>
    </div>
  );
  return (
    <div className='premium-card-container'>
           { current? <Badge.Ribbon style={{fontStyle:'italic'}} text={'Поточна підписка'} color="cyan-3">{cardContent}</Badge.Ribbon>
           : cardContent}
               
    </div>
    // <Badge.Ribbon className='' text={current?'Поточна підписка':''} color="cyan-3">
    // <div className='premium-card-conteiner text-center'>
    //    {name}
    // </div>
    //  </Badge.Ribbon>
  )
}
