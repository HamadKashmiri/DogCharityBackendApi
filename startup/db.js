const mongoose = require('mongoose');

function db() {
  
  const uri = 'mongodb+srv://hkhammer2:Hkhammer2.@cluster0.wjxer.mongodb.net/Database?retryWrites=true&w=majority'
  mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
  const connection = mongoose.connection;
  connection.once('open', () => {
      console.log("MongoDB database connection established successfully");
});
  
}

module.exports = db;


//mongoose.connect(dburi, { useNewUrlParser: true })
//  .then(() => console.log('MongoDB Connected...'))
 // .catch(err => console.error('MongoDB Connection Refused...', err.message))
