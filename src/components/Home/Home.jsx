import React, { useEffect, useState } from 'react'

export const Home = () => {
  const allMovieApi = 'http://localhost:5000/api/Movie/getall'
  const [movies,setMovies] = useState([]);
   useEffect( ()=>{
    getAllMovies()
  },[]);
  async function getAllMovies()
  {
    let result = await fetch(allMovieApi);
    let data = await result.json();
    console.log(data)
    setMovies(data);
  }

  return (
    <>
      {movies.map(x=><div>{x.name}</div>)}
    </>
   
    
  )
}
