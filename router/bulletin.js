"use strict";
const express = require('express');
const router = express.Router();

const mysql = require('../manager/mysql');

const constData = require('../utility/constData');
const response = constData.response;
const getResTemp = constData.getResTemp;
const stringIsNullOrEmpty = constData.stringIsNullOrEmpty;

router.all("/", (req, res, next) => {
    console.log(req.baseUrl + '(all)');
    next();
});

router.post("/", (req, res) => {
    let msg = req.body.msg;
    let type = req.body.type;
    mysql.modules.bulletin.create({ message: msg, type: type, create: Date.now() }).then(_ => {
        res.json(getResTemp(response.successful));
    });
});

router.get("/", (req, res) => {
    mysql.modules.bulletin.findAll({
        limit: 10,
        order: [['id', 'DESC']]//ASC 小->大 DESC 大->小
    }).then(result=>{
        res.json(getResTemp(response.successful,result));
    });
});

router.put("/", (req, res) => {
    res.send("put");
});

router.delete("/", (req, res) => {
    res.send("delete");
});

module.exports = {
    router: router
}