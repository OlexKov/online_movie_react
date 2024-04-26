import React, { useEffect, useState } from 'react'
import { movieService } from '../../services/MovieService';

export const Home = () => {
 
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    (async () => {
      const result = (await movieService.getMovies()).data;
      if(result)
          setMovies(result);
    })();
  }, []);

  return (
    <>
      {movies.map(x => <div key={x.id}>{x.name}</div>)}
    </>
  )
}
