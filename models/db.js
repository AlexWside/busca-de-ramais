const Sequelize = require('sequelize');

const sequelize = new Sequelize('alex', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql'
  });

    module.exports = {
        Sequelize: Sequelize,
        sequelize: sequelize
    }
 