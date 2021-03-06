Object.assign = require('object-assign');   //노드 하위버전에서 assign 메서드 지원용 모듈Ex
var express = require('express');
var router = express.Router();
var session = require('express-session');
var models = require('../models');
var fs = require('fs');
var path = require('path');
var async = require('async');
var mkdirp = require('mkdirp');
var multer = require('multer');
var config = require('../config/config.json')[process.env.NODE_ENV || "development"];


router.get('/:order_number',function(req,res,next){
  models.order_line_item.findAll({
    where:{sales_order_id: req.params.order_number},
    include: [models.items]
  }).then((data)=>{
    res.send(data);
  }).catch(()=>{
    res.send({result:false});
  })

});

router.post('/selectStore', function(req, res, next){
   models.sales_order.create({
   	order_number: req.body.order_number,
   	store_id: req.body.store_id,
   	user_id: req.body.user_id
   }).then(()=>{
    res.send({result:true})
  }).catch(()=>{
    res.send({result:false})
  })
});

router.post('/addItem', function(req,res,next){
	models.order_line_item.create({
		quantity: req.body.quantity,
		unitPrice: req.body.unitPrice,
		ExtendedPrice: req.body.quantity*req.body.unitPrice,
		sales_order_id: req.body.sales_order_id,
		items_id: req.body.items_id
	}).then(()=>{
    res.send({result:true})
  }).catch(()=>{
    res.send({result:false})
  });
});

router.get('/setTotal/:order_number',function(req,res,next){
  models.order_line_item.findAll({
    where:{sales_order_id: req.params.order_number}
  }).then((result)=>{

    var sum=0;
    for(var a in result){
      sum+=result[a].ExtendedPrice
    }

    models.sales_order.update({total: sum},{
      where:{order_number: req.params.order_number}
    }).then(()=>{
      res.send({result:true});
    }).catch(()=>{
      res.send({result:false});
    })
  });
});









module.exports = router;