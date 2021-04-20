const mongoose = require('mongoose');
const config = require('config');

function db() {
  
  dbEnv = config.get('dbUri');
  mongoose.connect(dbEnv, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
  const connection = mongoose.connection;
  connection.once('open', () => {
      console.log(`MongoDB database connection established successfully: ${dbEnv}`);
});
  
}

module.exports = db;


//mongoose.connect(dburi, { useNewUrlParser: true })
//  .then(() => console.log('MongoDB Connected...'))
 // .catch(err => console.error('MongoDB Connection Refused...', err.message))
