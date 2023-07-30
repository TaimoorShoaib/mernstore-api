class  userDTO{
    constructor(user){
        this._id = user._id
        this.username = user.username
        this.email = user.email
        this.name = user.name
        this.seller = user.seller
        this.phoneNumber = user.phoneNumber
        this.companyName = user.companyName
        
    }
}
module.exports = userDTO