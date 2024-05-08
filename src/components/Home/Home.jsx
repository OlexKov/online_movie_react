import React, { useEffect, useState } from 'react'
import { movieService } from '../../services/MovieService';
import { MovieCard } from '../MovieCard/MovieCard';
import { setRating } from '../../helpers/methods';
import './Home.css'
import { Empty, Pagination} from 'antd';

export const Home = () => {
  const startPage = 1;
  const StartPageSize = 5;
  const [movies, setMovies] = useState([]);
  const [moviesCount, setMoviesCount] = useState(0);
  
  useEffect(() => {
    (async () => { await setData(StartPageSize, startPage) })();
  }, []);

  const handleTableChange = async (pagination, filters) => {
    await setData(filters, pagination);
  };

  const setData = async (pageSize, pageIndex) => {
    const result = (await movieService.getMoviesWithPagination(pageSize, pageIndex)).data;
    if (result.movies)
      setMovies(await setRating(result.movies));
    setMoviesCount(result.totalCount)
  }

  return (
    <div className='d-flex flex-column gap-4'>
        {movies.length > 0 ?
            <>
              {movies?.map(x => <MovieCard className='movie-card' key={x.id} movie={x} />)}
              <Pagination
                defaultCurrent={startPage}
                defaultPageSize={StartPageSize}
                total={moviesCount}
                showTotal={(total, range) => `${range[0]} - ${range[1]}  з  ${total} `}
                showSizeChanger
                showQuickJumper
                className=' align-self-center'
                pageSizeOptions={[ 5, 10, 15, 20]}
                onChange={handleTableChange}
              />
            </>
       :<Empty />}
    </div>
  )
}
