const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const connect = (cb) =>{
  MongoClient.connect('mongodb+srv://tester-2:Aritya@cluster0.pzc6qyf.mongodb.net/?retryWrites=true&w=majority')
  .then((res) => {
    _db = res.db('shop');
    cb();
  })
  .catch(err => {
    console.log(err);
  })
}

const connection = () =>{
  if(_db){
    return _db;
  }
  throw 'No database found';
}

module.exports.connect = connect;
module.exports.connection = connection;

