"use strict";
const express = require('express');  
const router = express.Router();
const temp = require('../manager/data');

const constData = require('../utility/constData');  
const mysql = require('../manager/mysql');
const response = constData.response;
const getResTemp = constData.getResTemp;
const stringIsNullOrEmpty = constData.stringIsNullOrEmpty;

router.all("/",(req,res,next)=>{
    next();
});

router.post("/",(req,res)=>{
    res.send("post");
});

router.get("/",(req,res)=>{
    res.json(getResTemp(response.successful,{card:temp.cardData,task:temp.taskData}));
});

router.get("/taskDataAndcardData/count",(req,res)=>{
    let taskqrcode =req.query.taskqrcode;
    let cardid =req.query.cardid;
    let t = mysql.modules.task.count({where:{taskqrcode:taskqrcode}});
    let c= mysql.modules.card.count({where:{cardid:cardid}});
    Promise.all([t,c]).then(result=>{
        res.json(getResTemp(response.successful,result));
    })
});

router.get("/cardData/count",(req,res)=>{
    let cardid =req.query.cardid;
    mysql.modules.card.count({where:{cardid:cardid}}).then(result=>{
        res.json(getResTemp(response.successful,result));
    })
});

router.put("/",(req,res)=>{
    res.send("put");
});

router.delete("/",(req,res)=>{
    res.send("delete");
});

module.exports={
    router:router
}