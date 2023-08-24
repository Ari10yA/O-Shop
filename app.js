const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const uuid = require('uuid');
const helmet = require('helmet');
const compression = require('compression');

const express = require('express');
const bodyParser = require('body-parser');
// const {connect, connection} = require('./util/database');

const errorController = require('./controllers/error');
const User = require('./models/user');
const Cart = require('./models/cart');

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.pzc6qyf.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;

const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  }, 
  filename: (req, file, cb) => {
    cb(null, uuid.v4() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if(file.mimetype==='image/png' || file.mimetype==='image/jpg' || file.mimetype==='image/jpeg'){
    cb(null, true);
  }
  else{
    cb(null, false);
  }
}

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/login');


app.use(helmet());
app.use(compression());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  store: store
}));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
})

// app.use((req, res, next) => {
//   const newcart = new Cart(req.user._id);
//   newcart.save();
//   next();
// })

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect(MONGODB_URI)
.then(result => {
  // const user = new User({
  //   username: 'Aritya',
  //   email: 'aritya@gmail.com',
  //   products: []
  // })
  // user.save();

  // const cart = new Cart ({
  //   userId: new mongoose.Types.ObjectId('648476496e577c9fbcc08cde'),
  //   products: []
  // })

  // cart.save();
  app.listen(process.env.PORT || 4000, () => {
    console.log('Server is up and running on the localhost 4000');
  });
})
.catch(err => {
  console.log('its an error', err);
})


