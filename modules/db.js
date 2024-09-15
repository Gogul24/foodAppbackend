const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    categoryName:String,
    img:String
})

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
})

const ProductSchema = new mongoose.Schema({
    name:String,
    img:String,
    option: [{
        type: {
            type: String,
        },
        price: {
            type: Number,
        }
    }],
    Description:String,
    categoryName:{type:mongoose.Schema.Types.ObjectId,ref:'categories'}
})

const PurchaseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userdb', required: true },
    items: [{
      name: { type: String, required: true },
      selectedOption: {
        type: { type: String, required: true },
        price: { type: Number, required: true }
      },
      qty: { type: Number, required: true }
    }],
    total: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});


const UserModel = mongoose.model('userdb',UserSchema);
const CategoryModel = mongoose.model('categories',CategorySchema);
const ProdModel = mongoose.model('items',ProductSchema);
const PurchaseModel = mongoose.model('purchases', PurchaseSchema)

module.exports = { CategoryModel, ProdModel , UserModel , PurchaseModel };