const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const fs = require('fs');
const path = require('path');
const pdfkit = require('pdfkit');
const stripe = require('stripe')(`sk_test_51NN9AvSA9Qlpc8ooVO9sKWhQPkhQyEgckZ495Wn4wHIlVqhfTBGSwA9ch7pYXBGYWCYAhm0fVHPA2qO7b3cwZazP00q5dK2Wj6`)

//sk_test_51NN9AvSA9Qlpc8ooVO9sKWhQPkhQyEgckZ495Wn4wHIlVqhfTBGSwA9ch7pYXBGYWCYAhm0fVHPA2qO7b3cwZazP00q5dK2Wj6

const ITEMS_PER_PAGE = 4;


exports.getProducts = (req, res, next) => {
  let page = Number(req.query.page);
  if(!page) page = 1;
  let total;
  Product.countDocuments()
  .then(number => {
    total = number;
    return Product.find({})
    .skip((page-1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
      .then(products => {
        res.render('shop/product-list', {
          prods: products,
          pageTitle: 'All Products',
          path: '/products',
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < total,
          hasPreviousPage: page>1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(total/ITEMS_PER_PAGE)
        });
      })
      .catch(err => {
        console.log(err);
      });
  })
  .catch(err => {
    console.log(err);
  })


  // Product.find({})
  // .then(products => {
  //   res.render('shop/product-list', {
  //     prods: products,
  //     pageTitle: 'All Products',
  //     path: '/products',
  //     isAuthenticated: req.session.isLoggedIn,
  //     csrfToken: req.csrfToken()
  //   });
  // })
  // .catch(err => {
  //   console.log(err);
  // })
  
  
  // Product.fetchAll()
  //   .then(products => {
  //     res.render('shop/product-list', {
  //       prods: products,
  //       pageTitle: 'All Products',
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
};


exports.searchProducts =  (req, res, next) => {
  res.render('shop/search', {
    prods: [],
    pageTitle: "Search",
    path: '/search',
  })
}

exports.postSearchProducts = (req, res, next) => {
  const searchString = req.body.searchString;
  const regexPattern = new RegExp(searchString, 'i');

Product.find({ title: regexPattern })
    .then(products => {
      res.render('shop/search', {
        prods: products,
        pageTitle: "Search",
        path: '/search',
      })
    })
    .catch(err => {
      console.log(err);
    })
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(new ObjectId(prodId))
  .then(product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products',
      isAuthenticated: req.session.isLoggedIn
    });
  })
  .catch(err => {
    console.log(err);
  })
  // Product.findAll({ where: { id: prodId } })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
  
  // Product.findById(prodId)
  //   .then(product => {
  //     res.render('shop/product-detail', {
  //       product: product,
  //       pageTitle: product.title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));


};

exports.getIndex = (req, res, next) => {
  let page = Number(req.query.page);
  if(!page) page = 1;
  let total;
  Product.countDocuments()
  .then(number => {
    total = number;
    return Product.find({})
    .limit(ITEMS_PER_PAGE)
      .then(products => {
        res.render('shop/index', {
          prods: products,
          pageTitle: 'Shop',
          path: '/',
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < total,
          hasPreviousPage: page>1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(total/ITEMS_PER_PAGE)
        });
      })
      .catch(err => {
        console.log(err);
      });
  })
  .catch(err => {
    console.log(err);
  })
};

exports.getCart = (req, res, next) => {

  Cart.find({userId: req.user._id}).populate('products.prodId')
  .then(product => {
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      cart: product[0].products,
      isAuthenticated: req.session.isLoggedIn
    });
  })
  .catch(err => {
    console.log(err);
  })
  
  
  // Cart.fetchAll(req.user._id)
    // .then(cart => {
    //   res.render('shop/cart', {
    //     path: '/cart',
    //     pageTitle: 'Your Cart',
    //     cart: cart
    //   });
    // })
    // .catch()

    // .getCart()
    // .then(cart => {
    //   return cart
    //     .getProducts()
    //     .then(products => {
    //       res.render('shop/cart', {
    //         path: '/cart',
    //         pageTitle: 'Your Cart',
    //         products: products
    //       });
    //     })
    //     .catch(err => console.log(err));
    // })
    // .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;


  Cart.find({userId: req.user._id})
    .then(product => {
        return product[0].addToCart(req.user._id, prodId, product[0])
    })
    .then(() => {
      res.redirect('/products');
    })
    .catch(err => {
      console.log(err);
    })
  // let fetchedCart;
  // let newQuantity = 1;
  // req.user
  //   .getCart()
  //   .then(cart => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: prodId } });
  //   })
  //   .then(products => {
  //     let product;
  //     if (products.length > 0) {
  //       product = products[0];
  //     }

  //     if (product) {
  //       const oldQuantity = product.cartItem.quantity;
  //       newQuantity = oldQuantity + 1;
  //       return product;
  //     }
  //     return Product.findById(prodId);
  //   })
  //   .then(product => {
  //     return fetchedCart.addProduct(product, {
  //       through: { quantity: newQuantity }
  //     });
  //   })
  //   .then(() => {
  //     res.redirect('/cart');
  //   })
  //   .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Cart.find({userId: req.user._id})
  .then(product => {
      product[0].deleteFromCart(req.user._id, prodId, product[0])
      .then((result) => {
        res.redirect('/cart');
      })
  })

  // Cart.deleteProduct(prodId, req.user._id)
  // .then(() => {
  //   res.redirect('/cart');
  // })
  // .catch(err => console.log(err));


  // req.user
  //   .getCart()
  //   .then(cart => {
  //     return cart.getProducts({ where: { id: prodId } });
  //   })
  //   .then(products => {
  //     const product = products[0];
  //     return product.cartItem.destroy();
  //   })
  //   .then(result => {
  //     res.redirect('/cart');
  //   })
  //   .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {

  Cart.find({userId: req.user._id})
  .then(cart => {
    const existingCart = cart[0].products;
    const newOrder = new Order({
      userId: req.user._id,
      products: existingCart
    });
    newOrder.save()
    .then(() => {
      cart[0].resetCart()
        .then((result) => {
          res.redirect('/products');
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err)); 
  })






  // Cart.fetchAll(req.user._id)
  // .then(cart => {

  //   const fetchedCart = cart.reduce((result, { _id, quantity, userId, title}) => {
  //     const existingUser = result.find(obj => obj.userId.equals(userId));
  //     if (existingUser) {
  //       existingUser.products.push({ prodId: _id, quantity, title });
  //     } else {
  //       result.push({ userId, products: [{ prodId: _id, quantity, title }] });
  //     }
  //     return result;
  //   }, []);

  //   Order.addOrder(fetchedCart[0], req.user._id)
  //   .then(() => {
  //     Cart.resetCart(req.user._id)
  //     .then(() => {
  //       res.redirect('/products')
  //     });
  //   })
  // })

  // let fetchedCart;
  // req.user
  //   .getCart()
  //   .then(cart => {
  //     fetchedCart = cart;
  //     return cart.getProducts();
  //   })
  //   .then(products => {
  //     return req.user
  //       .createOrder()
  //       .then(order => {
  //         return order.addProducts(
  //           products.map(product => {
  //             product.orderItem = { quantity: product.cartItem.quantity };
  //             return product;
  //           })
  //         );
  //       })
  //       .catch(err => console.log(err));
  //   })
  //   .then(result => {
  //     return fetchedCart.setProducts(null);
  //   })
  //   .then(result => {
  //     res.redirect('/orders');
  //   })
  //   .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({userId: req.user._id}).populate('products.prodId userId')
  .then(orders => {
    console.log(orders);
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders,
      isAuthenticated: req.session.isLoggedIn
    });
  })


  // Order.fetchAll(req.user._id)
  // .then(orders => {
  //   res.render('shop/orders', {
  //     path: '/orders',
  //     pageTitle: 'Your Orders',
  //     orders: orders
  //   });
  // })
  // .catch()
  
  
  // req.user
  //   .getOrders({include: ['products']})
  //   .then(orders => {
  //     res.render('shop/orders', {
  //       path: '/orders',
  //       pageTitle: 'Your Orders',
  //       orders: orders
  //     });
  //   })
  //   .catch(err => console.log(err));
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  const invoiceName = 'invoices-' + orderId + '.pdf';
  const invoicePath = path.join('invoices', invoiceName);
  let totalPrice = 0;
  Order.find({userId: req.user._id, _id: orderId}).populate('products.prodId')
  .then(data => {
    const pdfDoc = new pdfkit();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="'+ invoiceName +'"');
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);
  
    pdfDoc.text('------Invoice------');
    data[0].products.forEach(prod=> {
      totalPrice += prod.quantity * prod.prodId.price;
      pdfDoc.text(prod.prodId.title + " - " + prod.quantity + " * " + prod.prodId.price);
    })
    pdfDoc.text('Total Price - ' + totalPrice);
    pdfDoc.end();
  })
  .catch(err => {
    res.redirect('pagenotfound');
    console.log(err);
  })



  // fs.readFile(invoicePath, (err, data) => {
  //   if(err){
  //     return res.redirect('/pagenotfound');
  //   } 
  //   res.setHeader('Content-Type', 'application/pdf');
  //   res.setHeader('Content-Disposition', 'attachment; filename="'+ invoiceName +'"')
  //   res.send(data)
  // });

  // Order.findById({_id: req.params.orderId})
  // .then((res) => {
  //   console.log(res);
  // })
  // .catch(err => {
  //   console.log(err);
  // })
}


exports.getCheckout = (req, res, next) => {
  console.log('log from get checkout');
  let total;
  let products;
  Cart.find({userId: req.user._id}).populate('products.prodId')
  .then(product => {
    total = 0;
    products = product[0].products;
    products.forEach(p => {
      total+=p.quantity * p.prodId.price;
    })
    
  const lineItems = products.map(product => ({
    price_data: {
      currency: 'inr',
      product_data: {
        name: product.prodId.title,
        description: product.prodId.description,
      },
      unit_amount: product.prodId.price,
    },
    quantity: product.quantity,
  }));

    return stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
      cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
    })
    .then((session) => {
      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        cart: products,
        totalSum: total,
        sessionId: session.id
      });
    })
    
  })
  .catch(err => {
    console.log(err);
  })
}


exports.getCheckoutSuccess = (req, res, next) => {
  Cart.find({userId: req.user._id})
  .then(cart => {
    const existingCart = cart[0].products;
    const newOrder = new Order({
      userId: req.user._id,
      products: existingCart
    });
    newOrder.save()
    .then(() => {
      cart[0].resetCart()
        .then((result) => {
          res.redirect('/products');
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err)); 
  }) 
}