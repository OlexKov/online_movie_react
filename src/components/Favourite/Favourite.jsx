import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Divider, Empty, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { accountService } from '../../services/AccountService'
import { SmallMovieCard } from '../SmallMovieCard/SmallMovieCard'


export const Favourite = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const userEmail = useSelector(state => state.user.data).email;
  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await accountService.getFavourites(userEmail);
      if (result.status === 200) {
        setMovies(result.data)
      }
      setLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Button shape="circle" onClick={() => window.history.back()} type="primary" icon={<ArrowLeftOutlined className='fs-4' />} />
      <div className='w-75 mx-auto'>
        <Divider className='fs-3  mb-5' orientation="left">Обрані фільми</Divider>
        <Spin delay={300} spinning={loading} fullscreen size='large' />
        <div className=' d-flex flex-wrap gap-5'>
          {movies?.length > 0
            ? (movies.map(x => <SmallMovieCard movie={x} />))
            : !loading && <Empty
              className='mx-auto'
              description='Немає обраних фільмів'
            />}
        </div>
      </div>
    </>
  )
}
