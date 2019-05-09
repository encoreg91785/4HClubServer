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

/**
 * key cardArray:array[]
 * key playerqrcode
 * 新增卡片
 */
router.post("/",(req,res)=>{
    let qr =req.body.playerqrcode;
    let cardArray =req.body.cardqrcode;
    if(cardArray!=null&&cardArray.length>0&&stringIsNullOrEmpty(qr)){
        let dataArray =[];
        cardArray.forEach(e=>{
            let d = {playerqrcode:qr,cardqrcode:e,create:Date.now()};
            dataArray.push(d);
        });
        mysql.modules.card.bulkCreate(dataArray).then(_=>{
            res.json(getResTemp(response.successful));
        }).catch(error=>{
            res.json(getResTemp(response.createError,error));
        });
    }
    else{
        res.json(getResTemp(response.createError,"params invalid"));
    }
});

/**
 * key playerqrcode
 * 取得玩家所卡片資料
 */
router.get("/",(req,res)=>{
    let playerqrcode =req.query.playerqrcode;
    if(stringIsNullOrEmpty(playerqrcode)){
        mysql.modules.card.findAll({where:{playerqrcode:playerqrcode}}).then(result=>{
            res.json(getResTemp(response.successful,result));
        }).catch(error=>{
            res.json(getResTemp(response.getError,error));
        });
    }
    else{
        res.json(getResTemp(response.getError,"player qrcode is null or Empty"));
    }
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