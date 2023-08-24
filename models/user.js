const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('./product');

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  token: String,
  validTill: Date
})


module.exports = mongoose.model('User', userSchema);
































// const {connection} = require('../util/database');
// const mongodb = require('mongodb');


// class User {
//   constructor(username, email){
//     this.username = username;
//     this.email = email;
//   }

//   save(){
//     const db = connection();
//     db.collection('users').insertOne(this)
//     .then(result => {
//       console.log(result);
//     })
//     .catch(err => {
//       console.log(err);
//     })
//   }

//   static findById(userId){
//     const db = connection();
//     return db.collection('users').findOne({_id: new mongodb.ObjectId(userId)})
//     .then(res => {
//         return res;
//     })
//     .catch(err =>{
//         console.log(err);
//     })
//   }

// }

// module.exports = User;
