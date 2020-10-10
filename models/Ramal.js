const db = require('./db')
const Ramal = db.sequelize.define('ramais', {
    // atributos da tabela
    nome: {
      type: db.Sequelize.STRING,
      //allowNull defaults to true
    },
    valor: {
      type: db.Sequelize.DOUBLE
    }
  });

  module.exports = Ramal
    
  