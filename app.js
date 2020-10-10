
  const express =  require('express')

   const app = express();

   const handlebars = require('express-handlebars')
   const bodyParser = require("body-parser")
   const Ramal = require('./models/Ramal')

   // aquisição do OP para uso na busca
   const db = require('./models/db')
   const Op = db.Sequelize.Op; // biblioteca de operadores

    app.engine('handlebars', handlebars({defaultLayout: 'main'}))// codigo necessario para rodar o handlebars
    app.set('view engine','handlebars')
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))//necessario para o body parse
 
    // parse application/json
    app.use(bodyParser.json())
    //rotas
    app.get('/all',function(req,res){//LISTAR TUDO
      
      Ramal.findAll().then(documents => {
        const context = {
          ramal: documents.map(document => {
            return {
              nome: document.nome,
              valor: document.valor,
              createdAt: document.createdAt,
              blax: document.updatedAt
            
            }
          })
        }
        res.render('ramal', {
            ramal: context.ramal,
            style: 'estilo-listar.css',
            titulo: 'Ramais'
        })
      })
    });// fim listar TUDO
    
    
    app.get('/cad-ramal',function(req,res){ // rota-chamada
      res.render('cad-ramal',{
          style: 'estilo.css',
          titulo: 'cadastro'
      })
    });
    //rotas
    app.get('/',function(req,res){// rota 
      res.render('busca',{
          style: 'estilo.css',
          titulo: 'Busca de Ramais'
      })
    });
    // ota
    app.post('/add-ramal',function(req,res){ //cadastrar
      //res.send ('nome: ' +req.body.nome + '<br>valor: ' + req.body.valor + '<br>')
      Ramal.create({
        nome: req.body.nome, 
         valor: req.body.valor
        }).then(function(){
          res.render('cad-res',{
            style: 'estilo.css',
            titulo: 'cadastrado com sucesso'
          })
        }).catch(function (err) {
         res.render('falha-cad',{
          style: 'estilo.css',
          titulo: 'falha cadastrado',
          erro: err
        } ) 
        })
    });// fim cadastrar
      
      app.post('/ramal',function(req,res){//BUSCA NO BANCO      
         var query = `${req.body.nome}%`; // string de consulta
         Ramal.findAll({ where: { nome: { [Op.like]: query } } })// ESPECIFICAÇÃO DA BUSCA
              .then(documents => {
                                // CRIAÇÃO DE UM OBJETO PARA TRANSPOSTA ESSA INFORMAÇÃO
                                 const context = {
                                  ramal: documents.map(document => {
                                    return {
                                      id: document.id,
                                      nome: document.nome,
                                      valor: document.valor,
                                      createdAt: document.createdAt,
                                      blax: document.updatedAt
                                    
                                    }
                                  })
                                }
                                
                                if(context.ramal!=''){// SE O OBJETO NÃO ESTIVER VAZIO IMPRIME
                                  res.render('ramal', {
                                    ramal: context.ramal,
                                    style: 'estilo-listar.css',
                                    titulo: 'Ramais',
                                    pesquisa: req.body.nome
                                })
                                
                                }else{// caso não encontre
                                  res.render('falha-busc', {
                                    ramal: context.ramal,
                                    style: 'estilo.css',
                                    titulo: 'Ramais'
                                    
                                })
                                }// fim else
                             });
      });// FIM DA BUSCA

     
      app.get('/del-ramal/:id',function(req,res){ //DELETAR 
          Ramal.destroy({
            where:{'id': req.params.id}
          }).then(function(){
            res.redirect('/') 
          }).catch(function(err){
            res.render('falha-cad',{
              erro: err
            })
          })
      });//FIM DELETAR
  
      app.get('/update-ramal/:id/:nome/:valor',function(req,res){ //INICIO ALTERAR RECEBER DADOS DA TELA
          res.render('update-ramal', {
            
            titulo: 'editor',
            id: req.params.id,
            nome: req.params.nome,
            valor: req.params.valor,
            style: 'estilo.css'
          })
      });// FIM RECEBER DADOS DA TELA
       
      app.post('/edit',function(req,res){// ALTERAR QUERY
          console.log(req.body.id)
          Ramal.update({ nome: req.body.nome ,valor: req.body.valor }, {
          where: {
            id: req.body.id
            
          }
          
        }).then(function(){
          res.redirect('/') 
        }).catch(function(err){
          res.render('falha-cad',{
            erro: err
          })
        });
      });// FIM ALTERAR QUERY
        
      

    // referencia a pasta publica
    app.use(express.static('public'))
    
   app.listen(8080)
   


   