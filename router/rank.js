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
    mysql.query("select r.name,r.team,r.amount,@rank := @rank + 1 AS `rank` from (SELECT @rank := 0) b ,(select final.*,count(*) as amount from (select p.name,p.team ,max(`create`) as lastTime,cardid from card JOIN player as p on playerqrcode=qrcode join carddata as cd on cd.id = cardid where type='主線' GROUP BY `name` ,cd.id) as final group by `name` ORDER BY amount DESC, lasttime) as r;").then(result=>{
        res.json(getResTemp(response.successful,result));
    }).catch(error=>{
        res.json(getResTemp(response.getError,error));
    });
});

router.get("/team",(req,res)=>{
    mysql.query("select r.team,r.amount,@rank := @rank + 1 AS `rank` from (SELECT @rank := 0) b ,(select final.*,count(*) as amount from (select p.name,p.team ,max(`create`) as lastTime,cardid from card JOIN player as p on playerqrcode=qrcode join carddata as cd on cd.id = cardid where type='主線' GROUP BY `name` ,cd.id) as final group by `team` ORDER BY amount DESC, lasttime) as r;").then(result=>{
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