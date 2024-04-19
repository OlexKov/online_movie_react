import React, { useEffect, useState } from 'react'

export const Home = () => {
  const allMovieApi = 'http://localhost:5000/api/Movie/getall'
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    (async () => {
      let result = await fetch(allMovieApi);
      let data = await result.json();
      setMovies(data);
    })();
  }, []);

  return (
    <>
      {movies.map(x => <div key={x.id}>{x.name}</div>)}
    </>
  )
}
