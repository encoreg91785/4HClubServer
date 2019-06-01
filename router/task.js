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
 * key playerqrcode:array[]
 * key taskqrcode
 * 新增玩家已完成的任務(尚未拿取卡片)
 */
router.post("/",(req,res)=>{
    let playerArray =req.body.playerqrcode;
    let task = req.body.taskqrcode;
    
    if(playerArray!=null&&playerArray.length>0&&stringIsNullOrEmpty(task)){
        let dataArray =[];
        playerArray.forEach(e=>{
            let d = {playerqrcode:e,taskqrcode:task,create:Date.now()};
            dataArray.push(d);
        })
        mysql.modules.task.bulkCreate(dataArray).then(_=>{
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
 * 取得玩家所完成的任務(尚未拿取卡片)
 */
router.get("/",(req,res)=>{
    let playerqrcode =req.query.playerqrcode;
    if(stringIsNullOrEmpty(playerqrcode)){
        mysql.modules.task.findAll({where:{playerqrcode:playerqrcode,submit:null}}).then(result=>{
            res.json(getResTemp(response.successful,result));
        }).catch(error=>{
            res.json(getResTemp(response.getError,error));
        });
    }
    else{
        res.json(getResTemp(response.getError,"player qrcode is null or Empty"));
    }
});

router.get("/all",(req,res)=>{
    mysql.modules.task.findAll().then(result=>{
        res.json(getResTemp(response.successful,result));
    }).catch(error=>{
        res.json(getResTemp(response.getError,error));
    });
});

/**
 * key taskid:Array[]
 * 玩家領取卡片
 */
router.put("/",(req,res)=>{
    let taskid =req.query.taskid;
    if(taskid!=null&&taskid.length>0){
        mysql.modules.task.update({submit:Date.now()},{
            where:{
                id:{[mysql.op.in]:taskid},
                submit:null
            }
        }).then(result=>{
            if(result>0)res.json(getResTemp(response.successful,result));
            else res.json(getResTemp(response.updateError,"effect result is zero"));
        }).catch(error=>{
            res.json(getResTemp(response.updateError,error));
        })
    }
    else{
        res.json(getResTemp(response.updateError,"taskid is null or Empty or type is not array"));
    }
});

router.delete("/",(req,res)=>{
    res.send("delete");
});

module.exports={
    router:router
}