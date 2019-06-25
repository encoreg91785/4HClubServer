"use strict";
const express = require('express');  
const router = express.Router();

const mysql = require('../manager/mysql');

const constData = require('../utility/constData');  
const response = constData.response;
const getResTemp = constData.getResTemp;

router.all("/",(req,res,next)=>{
    console.log(req.baseUrl+'(all)');
    next();
});

router.post("/",(req,res)=>{
    res.send("post");
});

router.get("/player",(req,res)=>{
    mysql.query("select p.name,p.team, playerqrcode, max(`create`) as lastTime,count(*) as NUM FROM card JOIN player as p on playerqrcode=qrcode GROUP BY playerqrcode ORDER BY NUM DESC ,lasttime ;").then(result=>{
        res.json(getResTemp(response.successful,result));
    }).catch(error=>{
        res.json(getResTemp(response.getError,error));
    });
});

router.get("/team",(req,res)=>{
    mysql.query("select p.name,p.team, playerqrcode, max(`create`) as lastTime,count(*) as NUM FROM card JOIN player as p on playerqrcode=qrcode GROUP BY playerqrcode ORDER BY NUM DESC ,lasttime ;").then(result=>{
        res.json(getResTemp(response.successful,result));
    }).catch(error=>{
        res.json(getResTemp(response.getError,error));
    });
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