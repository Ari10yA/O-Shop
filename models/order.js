//order should look like 
// {
//     userId: "some string",
//     products: [
//         {
//             prodId: "some string",
//             quantity: "x"
//         }
//     ]
// }

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },    
    products: [
        {
            prodId: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: Number
        }
    ]
})


module.exports = mongoose.model('Order', orderSchema);























// const {connection} = require('../util/database');

// class Order {
//     constructor(userId){
//         this.userId = userId;
//         this.products = [];    
//     }

//     static fetchAll(userId){
//         const db = connection();
//         return db.collection('orders').find({userId: userId}).toArray()
//         .then(result => {
//             console.log(result);
//             return result;
//         })
//         .catch(err => {
//             console.log(err);
//         })
//     }

//     static addOrder(fetchedCart, userId){
//         const db = connection();

//         return db.collection('users').findOne({_id: fetchedCart.userId})
//         .then(user => {
//             fetchedCart.username = user.username;
//             return db.collection('orders').insertOne(fetchedCart)
//             .then(result => {
//                 console.log(result);
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//         })
//     }

    

// }

// module.exports = Order;