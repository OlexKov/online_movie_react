export class FeedbackModel{
    constructor(text,rating,userId,movieId,date){
       this.text = text
       this.rating = rating
       this.userId = userId
       this.movieId = movieId
       this.approved = false;
       this.date = date
    }
}