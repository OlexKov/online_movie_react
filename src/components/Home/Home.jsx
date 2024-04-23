import React, { useEffect, useState } from 'react'
import { getAllMovie } from '../../helpers/api_helpers/MovieAPI';

export const Home = () => {
 
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    (async () => {
      const result = await getAllMovie();
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
