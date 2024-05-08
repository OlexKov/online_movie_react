import React, { useEffect, useState } from 'react'
import { movieService } from '../../services/MovieService';
import { MovieCard } from '../MovieCard/MovieCard';
import { setRating } from '../../helpers/methods';
import './Home.css'
import { Empty, Pagination, Spin} from 'antd';
import { paginatorConfig } from '../../helpers/constants';

export const Home = () => {
  const startPage = 1;
  const StartPageSize = 2;
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState([]);
  const [moviesCount, setMoviesCount] = useState(0);
  
  useEffect(() => {
    (async () => { await setData(StartPageSize, startPage) })();
  }, []);

  const handleTableChange = async (pagination, filters) => {
    await setData(filters, pagination);
  };

  const setData = async (pageSize, pageIndex) => {
    setLoading(true);
    const result = (await movieService.getMoviesWithPagination(pageSize, pageIndex)).data;
    setLoading(false)
    if (result.movies)
      setMovies(await setRating(result.movies));
    setMoviesCount(result.totalCount)
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
       :<Empty />}
    </div>
  )
}
