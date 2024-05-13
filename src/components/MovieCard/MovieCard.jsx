import React from 'react'
import './MovieCard.css'
import { Badge, Image, Rate } from 'antd'
import useToken from 'antd/es/theme/useToken'
import { Link } from 'react-router-dom'


export const MovieCard = ({ movie }) => {
  const themeToken = useToken()[1]
  return (
     <div style={{
       backgroundColor:themeToken.colorFillContent,
       borderColor:themeToken.colorFillContent}} 
       className='movie-card'>
       <div className='movie-header'>
        <Link style={{color:themeToken.colorTextDescription}} to={`/movie/${movie.id}`}>{movie.name}</Link>
        <Rate disabled allowHalf count={6} defaultValue={movie.rating} />
      </div>
      <hr />
      <div className='d-flex gap-3'>
      <Badge.Ribbon text={movie.qualityName} color="cyan-3">
        <div className='poster'>
        <Image
          width={250}
          src={movie.poster}
          preview={false}
          
        />
        </div>
        </Badge.Ribbon>
        <div className='movie-info'>
        <span className='value mb-3 fs-6'>{movie.description.slice(0,650)}...</span>
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
        
        </div>
      </div>
    
    </div>
  
    
  )
}
