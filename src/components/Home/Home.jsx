import React, { useEffect, useState } from 'react'
import { movieService } from '../../services/MovieService';
import { MovieCard } from '../MovieCard/MovieCard';
import './Home.css'
import { Empty, Pagination, Spin } from 'antd';
import { paginatorConfig } from '../../helpers/constants';

export const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [moviesCount, setMoviesCount] = useState(0);

  useEffect(() => {
    (async () => { await setData(paginatorConfig.pagination.defaultPageSize, paginatorConfig.pagination.defaultCurrent) })();
  }, []);

  const handleTableChange = async (pagination, filters) => {
    await setData(filters, pagination);
  };

  const setData = async (pageSize, pageIndex) => {
    setLoading(true);
    const result = (await movieService.getMoviesWithPagination(pageSize, pageIndex)).data;
    setLoading(false)
    if (result?.elements?.length > 0) {
      setMovies(await movieService.setRating(result.elements));
      setMoviesCount(result.totalCount)
    }
  }

  return (
    <div className='d-flex flex-column gap-4'>
      <Spin spinning={loading} delay={300} size='large' fullscreen />
      {movies.length > 0 ?
        <>
          {movies?.map(x => <MovieCard className='movie-card' key={x.id} movie={x} />)}
          <Pagination
            defaultCurrent={paginatorConfig.pagination.defaultCurrent}
            defaultPageSize={paginatorConfig.pagination.defaultPageSize}
            total={moviesCount}
            showTotal={paginatorConfig.pagination.showTotal}
            showSizeChanger
            showQuickJumper
            className=' align-self-center'
            pageSizeOptions={paginatorConfig.pagination.pageSizeOptions}
            onChange={handleTableChange}
            locale={paginatorConfig.pagination.locale}
          />
        </>
        : <Empty />}
    </div>
  )
}
