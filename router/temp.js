"use strict";
const express = require('express');  
const router = express.Router();
const temp = require('../manager/data');

const constData = require('../utility/constData');  
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

router.put("/",(req,res)=>{
    res.send("put");
});

router.delete("/",(req,res)=>{
    res.send("delete");
});

module.exports={
    router:router
}