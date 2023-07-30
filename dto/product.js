class  productDTO{
    constructor(product){
        this._id = product._id
        this.photoPath = product.photoPath
        this.productName = product.productName
        this.price = product.price
        this.decs = product.decs
        this.ownerUsername = product.owner.username
        this.ownerCompanyName = product.owner.companyName
        this.ownerPhoneNumber = product.owner.phoneNumber
        this.ownerEmail = product.owner.email
        this.numOfProduct = product.numOfProduct
        this.productSold = product.productSold
        this.type = product.type
        this.createdAt = product.createdAt
    }
}
module.exports = productDTO