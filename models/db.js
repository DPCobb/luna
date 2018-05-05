const db = require('./weather.js');

// create a new db entry in urls table
exports.create = (data, success, err) => {
    db.weatherData.create(data).then(success).catch(err);
};
exports.findAll = (data, err) => {
  db.weatherData.find({where:{id: 1}}).then(data).catch(err);
};
