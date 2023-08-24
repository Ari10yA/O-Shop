const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: String,
  price: Number,
  imageUrl: String,
  description: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

module.exports = mongoose.model('Product', productSchema);






















// const {connection} = require('../util/database');
// const mongodb = require('mongodb');

// class Product {
//   constructor(title, price, description, imageUrl, userId){
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this.userId = userId;
//   }

//   save(){
//     const db = connection();
//     return db.collection('products').insertOne(this)
//     .then(result => {
//       console.log(result);
//     })
//     .catch(err => {
//       console.log(err);
//     })
//   }

//   static fetchAll(){
//     const db = connection();
//     return db.collection('products').find({}).toArray();
//   }

//   static findById(prodId){
//     const db = connection();
//     return db.collection('products').find({_id:  new mongodb.ObjectId(prodId)}).next()
//     .then(product => {
//         return product;
//     })
//     .catch(err => {
//       console.log(err);
//     })
//   }

//   static updateData(title, price, description, imageUrl, prodId, userId){
//     const db = connection();
//     var myquery = { _id: new mongodb.ObjectId(prodId)};
//     var newvalues = { $set: {title: title, price: price, description: description, imageUrl: imageUrl, userId: userId } };
//     return db.collection('products').updateOne(myquery, newvalues)
//     .then(result => {
//       console.log(result);
//     })
//     .catch(err => {
//       console.log(err);
//     })
//   }
  
//   static deleteById(prodId){
//     const db = connection();
//     return db.collection('products').deleteOne({_id: new mongodb.ObjectId(prodId)})
//     .then(res => {
//       console.log(res);
//     })
//     .catch(err => {
//       console.log(err);
//     })
//   }
// }


// module.exports = Product;