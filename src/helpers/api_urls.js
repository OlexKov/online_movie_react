const host = 'http://localhost:5000'
const dataAPIUrl = host + '/api/Data'
const movieAPIUrl = host +'/api/Movie'
const stafAPIUrl =  host +'/api/Staf'

// Data APIs
export const rolesDataAPIUrl = dataAPIUrl + '/getroles'
export const countriesDataAPIUrl = dataAPIUrl + '/getcountries'

//Movie APIs
export const allMovieAPIUrl = movieAPIUrl + '/getall'
export const deleteMovieAPIUrl =  movieAPIUrl + '/delete/'
export const movieRatingAPIUrl = movieAPIUrl + '/getrating/'

//Staf APIs
export const allStafAPIUrl = stafAPIUrl + '/getall'
export const stafByIdAPIUrl = stafAPIUrl + '/get/'
export const stafMoviesAPIUrl = stafAPIUrl + '/getmovies/'
export const stafRolesAPIUrl = stafAPIUrl + '/getroles/'
export const createStafAPIUrl = stafAPIUrl + '/create'
export const deleteStafAPIUrl = stafAPIUrl + '/delete'
export const updateStafAPIUrl = stafAPIUrl + '/update'