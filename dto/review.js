class  reviewDTO{
    constructor(review){
        this._id = review._id
        this.content = review.content
        this.authorUsername = review.author && review.author.username; // Add null check
        this.product = review.product
        this.rating = review.rating
        this.createdAt = review.createdAt
        
    }
}
module.exports = reviewDTO