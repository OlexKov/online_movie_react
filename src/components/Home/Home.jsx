import React, { useEffect, useState } from 'react'
import { getMovies } from '../../helpers/api_helpers/MovieAPI';

export const Home = () => {
 
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    (async () => {
      const result = await getMovies();
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
