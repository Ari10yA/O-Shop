const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema ({
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
});



cartSchema.methods.addToCart = function (userId, prodId, cart) {
    let existing_products = cart.products;
    
    if(existing_products.length==0){
        //no products are there in the cart for that user
        
        const updatedProduct = {
            prodId: prodId,
            quantity: 1
        };
        existing_products.push(updatedProduct);

        this.products = existing_products;
        return this.save();
    }

    else{

        const index = existing_products.findIndex((product => {
            return product.prodId==prodId;
        }))
        if(index==-1){
            const updatedProduct = {
                prodId: prodId,
                quantity: 1
            };
            existing_products.push(updatedProduct);

            this.products = existing_products;
            return this.save();
        }
        else{

            const updatedProduct = existing_products[index];
            const updatedQuantity = updatedProduct.quantity + 1;
    
            const newUpdatedProduct = {
                prodId: prodId,
                quantity: updatedQuantity
            }
    
            existing_products[index] = newUpdatedProduct;
            this.products = existing_products;
            return this.save();
        }
    }



    /*
    const db = connection();
    db.collection('carts').findOne({userId: userId})
    .then(cart => {
        let existing_products = cart.products;

        if(existing_products.length==0){
            //no products are there in the cart for that user
            
            const updatedProduct = {
                prodId: prodId,
                quantity: 1
            };
            existing_products.push(updatedProduct);

            return db.collection('carts').updateOne({userId: userId}, {$set: {products: existing_products}})
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            })
        }

            else{
            //it means there are products in the existing cart more precisely existing_products array
            const index = existing_products.findIndex((product => {
                return product.prodId==prodId;
            }))
            //if product not found
            if(index==-1){
                const updatedProduct = {
                    prodId: prodId,
                    quantity: 1
                };
                existing_products.push(updatedProduct);

                return db.collection('carts').updateOne({userId: userId}, {$set: {products: existing_products}})
                .then(result => {
                    console.log(result);
                })
                .catch(err => {
                    console.log(err);
                })
            }
            //index exist means same product found
            const updatedProduct = existing_products[index];
            const updatedQuantity = updatedProduct.quantity + 1;

            const newUpdatedProduct = {
                prodId: prodId,
                quantity: updatedQuantity
            }

            existing_products[index] = newUpdatedProduct;
            return db.collection('carts').updateOne({userId: userId}, {$set: {products: existing_products}})
                .then(result => {
                    console.log(result);
                })
                .catch(err => {
                    console.log(err);
                })

            }
    })
    .catch(err => {
        console.log(err);
    })
    */
}


cartSchema.methods.deleteFromCart = function (userId, prodId, cart) {

        const existingCart = cart.products;
        const updatedCart = existingCart.filter(cart => {
            return cart.prodId.toString() !== prodId.toString()
        })
        
        this.products = updatedCart;
        return this.save();
}

cartSchema.methods.resetCart = function () {
    this.products = [];
    return this.save();
}


module.exports = mongoose.model('Cart', cartSchema);





// const {connection} = require('../util/database');
// const mongodb = require('mongodb');



// class Cart {
//     constructor(userId){
//         this.userId = userId;
//         this.products = [];
//     }

//     save(){
//         const db = connection();
//         return db.collection('carts').insertOne(this);
//     }
//     //product = [{prodId: x, quantity: x}]

//     static fetchAll(userId){
//         const db = connection();
//         return db.collection('carts').findOne({userId: userId})
//         .then(result => {
//             const productInfo = result.products;

//             const objectIds = productInfo.map(obj => {
//                 return new mongodb.ObjectId(obj.prodId);
//             }) 

//             return db.collection('products').find({_id: {$in : objectIds}}).toArray()
//             .then(products => {

//                 const quantityMap = [];
//                 productInfo.forEach(product => {
//                     quantityMap[product.prodId] = product.quantity;
//                 })

//                 const combinedResults = products.map(product => {
//                     const quantity = quantityMap[product._id.toString()];
//                     return { ...product, quantity };
//                 });

//                 return combinedResults;
//             })
//             .catch(err => {
//                 console.log(err);
//             })

//         })
//         .catch(err => {
//             console.log(err);
//         })
//     }


//     static addToCart(userId, prodId) {
//         const db = connection();
//         db.collection('carts').findOne({userId: userId})
//         .then(cart => {
//             let existing_products = cart.products;

//             if(existing_products.length==0){
//                 //no products are there in the cart for that user
                
//                 const updatedProduct = {
//                     prodId: prodId,
//                     quantity: 1
//                 };
//                 existing_products.push(updatedProduct);

//                 return db.collection('carts').updateOne({userId: userId}, {$set: {products: existing_products}})
//                 .then(result => {
//                   console.log(result);
//                 })
//                 .catch(err => {
//                   console.log(err);
//                 })
//             }

//              else{
//                 //it means there are products in the existing cart more precisely existing_products array
//                 const index = existing_products.findIndex((product => {
//                     return product.prodId==prodId;
//                 }))
//                 //if product not found
//                 if(index==-1){
//                     const updatedProduct = {
//                         prodId: prodId,
//                         quantity: 1
//                     };
//                     existing_products.push(updatedProduct);

//                     return db.collection('carts').updateOne({userId: userId}, {$set: {products: existing_products}})
//                     .then(result => {
//                       console.log(result);
//                     })
//                     .catch(err => {
//                       console.log(err);
//                     })
//                 }
//                 //index exist means same product found
//                 const updatedProduct = existing_products[index];
//                 const updatedQuantity = updatedProduct.quantity + 1;

//                 const newUpdatedProduct = {
//                     prodId: prodId,
//                     quantity: updatedQuantity
//                 }

//                 existing_products[index] = newUpdatedProduct;
//                 return db.collection('carts').updateOne({userId: userId}, {$set: {products: existing_products}})
//                     .then(result => {
//                       console.log(result);
//                     })
//                     .catch(err => {
//                       console.log(err);
//                     })
    
//              }
//         })
//         .catch(err => {
//             console.log(err);
//         })
//     }

//     static deleteProduct(prodId, userId){
//         const db = connection();
//         return db.collection('carts').findOne({userId: userId})
//         .then(cart => {
//             const existingCart = cart.products;
//             const updatedCart = existingCart.filter(cart => {
//                 return cart.prodId !== prodId.toString()
//             })
//             return db.collection('carts').updateOne({userId: userId}, {$set: {
//                 products: updatedCart
//             }})
//         })
//         .catch(err => {

//         })
//     }

//     static resetCart(userId){
//         const db = connection();
//         return db.collection('carts').updateOne({userId: userId}, {$set: {products: []}})
//         .then(result => {
//             console.log(result);
//         })
//         .catch(err => {
//             console.log(err);
//         })
//     }
// }

// module.exports = Cart