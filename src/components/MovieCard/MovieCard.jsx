import React from 'react'
import './MovieCard.css'
import { Image, Rate } from 'antd'
export const MovieCard = ({ movie }) => {
  return (
    <div className='movie-card'>
      <div className='movie-header'>
        <h5>{movie.name}</h5>
        <Rate disabled allowHalf count={6} defaultValue={movie.rating} />
      </div>
      <hr />
      <div className='d-flex gap-3'>
        <div className='poster'>
        <Image
          width={250}
          src={movie.poster}
          preview={false}
          
        />
        </div>
        
        <div className='movie-info'>
             <div className='info'>
                 <span className='title'>Oригінальна назва:</span>
                 <span className='value'>{movie.originalName}</span>
             </div>
             <div className='info'>
                 <span className='title'>Тривалість:</span>
                 <span className='value'>{movie.duration.slice(0,5)}</span>
             </div>
             <div className='info'>
                 <span className='title'>Дата релізу:</span>
                 <span className='value'>{movie.date}</span>
             </div>
             <div className='info'>
                 <span className='title'>Kраїна:</span>
                 <span className='value'>{movie.countryName}</span>
             </div>
             <div className='info'>
                 <span className='title'>Якість:</span>
                 <span className='value'>{movie.qualityName}</span>
             </div>
             <div className='d-flex flex-column'>
                 <span className='title'>Опис:</span>
                 <span className='value mx-3'>{movie.description.slice(0,650)}...</span>
             </div>
             
        </div>
      </div>
    </div>
  )
}
