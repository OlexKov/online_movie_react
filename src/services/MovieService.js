import axios from "axios";
import { TryError } from "../helpers/ErrorCatch";
import { formPostConfig } from "../helpers/constants";
const movieApiUrl  = process.env.REACT_APP_MOVIE_API_URL
export const movieService = {
      getMovies: () => TryError(() => axios.get(movieApiUrl + '/getall')),

      getMovie: (id) => TryError(() => axios.get(movieApiUrl + '/get/' + id)),

      deleteMovie: (id) => TryError(() => axios.delete(movieApiUrl + '/delete/' + id)),

      updateMovie: (movie) => TryError(() => axios.put(movieApiUrl + '/update', movie,formPostConfig)),

      createMovie: (movie) => TryError(() => axios.post(movieApiUrl + '/create', movie,formPostConfig)),

      getRating: (id) => TryError(() => axios.get(movieApiUrl + '/getrating/' + id)),

      getMovieStafs: (id) => TryError(() => axios.get(movieApiUrl + '/getstafs/' + id)),

      getMovieScreens: (id) => TryError(() => axios.get(movieApiUrl + '/getscreens/' + id)),

      getMovieGenres: (id) => TryError(() => axios.get(movieApiUrl + '/getgenres/' + id)),

      getMoviesWithPagination: (pageSize,pageIndex) => TryError(() => axios.post(movieApiUrl + `/paginatefilter`,{findModel:null,pageSize,pageIndex})),

      getFilteredMoviesWithPagination: (findModel,pageSize,pageIndex) => TryError(() => axios.post(movieApiUrl + `/paginatefilter`,{findModel,pageSize,pageIndex})),

      getMovieFeedbacks:(id,pageIndex,pageSize) => TryError(() => axios.get(`${movieApiUrl}/getfeedbacks/${id}/${pageIndex}/${pageSize}`)),
      
      hasFeedback: async (movieId,userId)=> TryError(() => axios.get(`${movieApiUrl}/hasfeedback?movieId=${movieId}&userId=${userId}`)),

      getNotApprovedMovieFeedbacks:(id,pageIndex,pageSize) => TryError(() => axios.get(`${movieApiUrl}/getfeedbacks/notapproved/${id}/${pageIndex}/${pageSize}`)),

      setRating: async (data) => {
            await axios.all(data.map(x => movieService.getRating(x.id)))
                .then(axios.spread((...res) => {
                    res.forEach((val, index) => {
                        data[index].rating = val.data;
                    })
                }));
            return data;
        },
     deleteFeedback:(feedbackId)=>TryError(() => axios.delete(`${movieApiUrl}/deletefeedback/${feedbackId}`)), 

     addFeedback:(feedback)=>TryError(() => axios.post(`${movieApiUrl}/addfeedback`,feedback,formPostConfig)), 
     
     approveFeedback:(feedbackId)=>TryError(() => axios.put(`${movieApiUrl}/approvefeedback/`+ feedbackId)),  

     getMoviesWithNotApprovedFeedbacks: (pageSize,pageIndex) => TryError(() => axios.get(movieApiUrl + `/getmovies/withnotapproved/${pageIndex}/${pageSize}`)),

     getNotApprovedFeedbacksCount: () => TryError(() => axios.get(movieApiUrl + `/get/notapproved/count`)),

    
}

