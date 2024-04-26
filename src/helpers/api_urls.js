const host = 'http://localhost:5000'
const dataAPIUrl = host + '/api/Data'
const movieAPIUrl = host +'/api/Movie'
const stafAPIUrl =  host +'/api/Staf'

// Data APIs
export const rolesDataAPIUrl = dataAPIUrl + '/getroles'
export const countriesDataAPIUrl = dataAPIUrl + '/getcountries'
export const qualitiesDataAPIUrl = dataAPIUrl + '/getqualities'
export const genresDataAPIUrl = dataAPIUrl + '/getgenres'
export const premiumsDataAPIUrl = dataAPIUrl + '/getpremiums'


//Movie APIs
export const allMovieAPIUrl = movieAPIUrl + '/getall'
export const deleteMovieAPIUrl =  movieAPIUrl + '/delete/'
export const movieRatingAPIUrl = movieAPIUrl + '/getrating/'
export const movieByIdAPIUrl = movieAPIUrl + '/get/'
export const movieScreensAPIUrl = movieAPIUrl + '/getscreens/'
export const movieGenresAPIUrl = movieAPIUrl + '/getgenres/'
export const movieStafsAPIUrl = movieAPIUrl + '/getstafs/'
export const createMovieAPIUrl = movieAPIUrl + '/create'
export const updateMovieAPIUrl = movieAPIUrl + '/update'

//Staf APIs
export const allStafAPIUrl = stafAPIUrl + '/getall'
export const stafByIdAPIUrl = stafAPIUrl + '/get/'
export const stafMoviesAPIUrl = stafAPIUrl + '/getmovies/'
export const stafRolesAPIUrl = stafAPIUrl + '/getroles/'
export const createStafAPIUrl = stafAPIUrl + '/create'
export const deleteStafAPIUrl = stafAPIUrl + '/delete/'
export const updateStafAPIUrl = stafAPIUrl + '/update/'