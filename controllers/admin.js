const Product = require('../models/product');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const ITEMS_PER_PAGE = 5;

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  
  if(!image){
    return res.status(422).redirect('/pagenotfound');
  }

  const imageUrl = image.path;


  const product = new Product(
    {
      title: title, 
      price: price,
      imageUrl: imageUrl,
      description: description,
      userId: req.user._id
    }
  );

  product.save()
  .then(() => {
    res.redirect('/admin/products');
  })
  
  // req.user
  //   .createProduct({
  //     title: title,
  //     price: price,
  //     imageUrl: imageUrl,
  //     description: description
  //   })
  //   .then(result => {
  //     // console.log(result);
  //     console.log('Created Product');
  //     res.redirect('/admin/products');
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;

    Product.findById(new ObjectId(prodId))
    .then(products => {
      if (!products) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: products,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findByIdAndUpdate(new ObjectId(prodId), {title: updatedTitle, price: updatedPrice, imageUrl: updatedImageUrl, description: updatedDesc})
  .then(update => {
    res.redirect('/admin/products')
  })
  .catch(err => {
    console.log(err);
  })
  // Product.updateData(updatedTitle, updatedPrice, updatedDesc, updatedImageUrl, prodId, req.user._id)
  // .then(() => {
  //   res.redirect('/admin/products');
  // })
  // Product.findById(prodId)
  //   .then(product => {
  //     product.title = updatedTitle;
  //     product.price = updatedPrice;
  //     product.description = updatedDesc;
  //     product.imageUrl = updatedImageUrl;
  //     return product.save();
  //   })
  //   .then(result => {
  //     console.log('UPDATED PRODUCT!');
  //     res.redirect('/admin/products');
  //   })
  //   .catch(err => console.log(err));
};

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
        res.render('admin/products', {
          prods: products,
          pageTitle: 'Admin Products',
          path: '/admin/products',
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

    // return Product.find({userId: req.user._id})
    // .then(products => {
    //   return res.render('admin/products', {
    //     prods: products,
    //     pageTitle: 'Admin Products',
    //     path: '/admin/products',
    //   });
    // })
    // .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(new ObjectId(prodId))
    .then((result) => {
      console.log(result);
      console.log('Product removed');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
