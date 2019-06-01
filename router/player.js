"use strict";
const express = require('express');  
const router = express.Router();
const mysql = require('../manager/mysql');

const constData = require('../utility/constData');  
const response = constData.response;
const getResTemp = constData.getResTemp;
const stringIsNullOrEmpty = constData.stringIsNullOrEmpty;

router.all("/",(req,res,next)=>{
    console.log(req.baseUrl+'(all)');
    next();
});

router.post("/",(req,res)=>{

    res.send("post");
});

/**
 * key playerqrcode
 * 取得玩家資料並更新update欄位
 */
router.get("/",(req,res)=>{
    let qr=req.query.playerqrcode;
    if(stringIsNullOrEmpty(qr)){
        mysql.modules.player.findOne({
            where:{qrcode: qr,}
        }).then(result=>{
            if(result!=null){
                result.update({update:Date.now()});
                result.update=Date.now();
            }
            res.json(getResTemp(response.successful,result));
        });
    }
    else{
        res.json(getResTemp(response.getError,"player qrcode is null or empty"));
    }
});

router.get("/all",(req,res)=>{
    mysql.modules.player.findAll().then(result=>{
        res.json(getResTemp(result.successful,result));
    });
});

/**
 * key playerqrcode,name,team
 * 
 * 更新玩家name team
 */
router.put("/",(req,res)=>{
    let qr=req.query.playerqrcode;
    let updateData =req.query.updateData;
    if(stringIsNullOrEmpty(qr)&&stringIsNullOrEmpty(updateData)){
        updateData = JSON.parse(updateData);
        mysql.modules.player.update(
            updateData
        ,
        {
            where:{qrcode:qr}
        }).then(_=>{
            res.json(getResTemp(response.successful));
        });
    }
    else{
        res.json(getResTemp(response.updateError,"player qrcode is null or empty"));
    }
    
});


module.exports={
    router:router
}