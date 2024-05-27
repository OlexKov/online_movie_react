import { Badge, Image } from 'antd'
import React from 'react'
import '../SmallMovieCard/SmallMovieCard.css'
import { useNavigate } from 'react-router-dom'

export const SmallMovieCard = ({ movie }) => {
    const navigator = useNavigate()
    return (
        <div className='movie-card-badge' onClick={() => navigator(`/movie/${movie.id}`)}>
            <Badge.Ribbon text={movie.qualityName} color="cyan-3">
                <div className='small-card-conteiner text-center'>
                    <Image
                        width={220}
                        src={movie.poster}
                        preview={false}
                    />
                    <span className=' fs-6 fw-bold text-wrap m-2'>{`${movie.name} (${movie.originalName})`}</span>
                </div>
            </Badge.Ribbon>
        </div>
    )
}
