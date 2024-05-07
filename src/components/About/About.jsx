import React from 'react'
import './About.css'
import newImage from '../../images/new.jpg'
import freeImage from '../../images/free.jpg'
import premiumImage from '../../images/premium.jpg'

export const About = () => {
  return (
   <>
   
    <h1 className='about-title' >Про нас</h1>
    <div className="about-container text-center">
        <h2>Ласкаво просимо на наш сайт</h2>
        <p className='fs-5 text-info'>Ми прагнемо пропонувати вам найкращі фільми для вашої розваги. Ознайомтеся з нашою колекцією та насолоджуйтеся враженнями від кіно, не виходячи з дому.</p>
        <h2>Рекомендуємо</h2>
        <div className="video-section">
            <div className="video-card">
                <img src={freeImage} alt="Video 1"/>
                <h3>Безкоштовні фільми</h3>
           </div>
            <div className="video-card">
                <img src={newImage} alt="Video 2"/>
                <h3>Новинкі</h3>
            </div>
            <div className="video-card">
                <img src={premiumImage} alt="Video 3"/>
                <h3>Преміум фільми найкращої якості</h3>
            </div>
        </div>
    </div>
   </>
  )
}
