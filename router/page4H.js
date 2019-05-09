"use strict";
const express = require('express');  
const router = express.Router();

router.all("/",(req,res,next)=>{
    console.log(req.baseUrl+'(all)');
    next();
});

router.post("/",(req,res)=>{
    res.send("post");
});

router.get("/",(req,res)=>{
    res.setHeader('Content-Type', 'text/html');
    res.sendfile('./html/page4H.html');
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