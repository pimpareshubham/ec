const mongoose  = require('mongoose')

const featuredProductSchema = new mongoose.Schema({

    productName:{
        type:String,
        required:true
    },

    productPrice:{
        type:Number,
        required:true
    },
    productDescription:{
        type:String,
        required:true
    },
    productImage:{
        type:String,
        required:true
    },
    cartQuantity:{
        type:Number
    },
    productReviews:{
        type:Array,
        default: []
    }
    
    
})

mongoose.model("FeaturedProductModel",featuredProductSchema)