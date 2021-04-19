const config = require('config');

module.exports = function()  {
    if(!config.get('jwtPrivateKey')) {
      console.log('no jwt key');
      process.exit(1);
}
};
    

