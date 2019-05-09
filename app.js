"use strict";
const fs = require('fs');
const express = require('express');  
const axios = require('axios');  
const bodyParser = require('body-parser');
const multer = require('multer');
const multipart = multer().any();

const mysql = require('./manager/mysql.js');
const config = require('./config.json');

const app = express();

let oldIp = "0.0.0.0";

errorToJSON();
mysql.connect(config.DB.schema,config.DB.account,config.DB.password,config.DB.option).then(_=>{
    return updateIp();
}).then(_=>{
    return loadManager();//確認所有Manager都初始化完成
}).then(_=>{
    startServer();//都完成後才會開始RunServer
});

/**
 * 初始化所有Manager
 */
function loadManager(){
    const api = loadAllScript("./manager");//初始化所有Manager 回傳 Promise
    let p=[];
    Object.keys(api).forEach(key=>{
        if(api[key]['init']!=null)
        {
            p.push(api[key]['init']());
        }
    });
    return Promise.all(p);
}

/**
 * 讀取所有Router
 */
function loadRouter(){
    const method = loadAllScript("./router");//讀取所有Router
    Object.keys(method).forEach(key=>{
        if(method[key]['router']!=null)app.use('/'+key,method[key]['router']);
    });
}

/**
 * 開始啟動服務
 * 1.啟動美6小時檢驗IP是否更動
 * 2.資料解析
 * 3.讀取所有Router
 */
function startServer()
{
    setInterval(updateIp,6*60*60*1000);//每6小時更新一次IP
    app.use(parseMultipart);
    app.use(bodyParser.json({limit: '50mb'}));//json
    app.use(bodyParser.urlencoded({extended:true ,limit: '50mb',parameterLimit:50000}));//x-www-form-urlencoded
    app.use(verify);
    app.use(express.static('page'));
    loadRouter();
    app.listen(12121,'0.0.0.0',()=>{console.log('Server Is Run');}); 
}

/**
 * multipart/form-data
 * 上傳資料 
 */
function parseMultipart(req,res,next){
    multipart(req,res,(err)=>{
        if (err instanceof multer.MulterError) {
            res.json(getResTemp(result.uploadError,err)); // A Multer error occurred when uploading.
        } 
        else if (err) {
            // An unknown error occurred when uploading.
            res.json(getResTemp(result.uploadError,err));
        }
        else next();
          
    })
}

/**
 * 檢查是否合法
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function verify(req,res,next)
{
    console.log("verify");
    next();
}

/**
 * 更新IP到FireBase
 */
function updateIp(){
    const getOldIp = axios.get("https://rpg4hproject.firebaseio.com/IP.json");
    const getCurrentIp= axios.get("http://ifconfig.me/ip");
    return Promise.all([getOldIp,getCurrentIp]).then(result=>{
        if(result[0].data)oldIp = result[0].data.ip||oldIp;
        if(oldIp!=result[1].data){
            axios.put("https://rpg4hproject.firebaseio.com/IP.json",{ip:oldIp});
        }
    });
}

/**
 * 讀取路徑下所有js
 * 將方法裝成Object回傳
 * @param {string} path
 * @return {{string:function}}
 */
function loadAllScript(path){
    var methods={};
    var files =  fs.readdirSync(path);
    files.forEach(file=>{
        var filename = file.split(".")[0];
        methods[filename] = require(path+'/'+file);
    })
    return methods;
}

/**
 * 讓Error訊息可以被轉成JSON
 */
function errorToJSON()
{
    if (!('toJSON' in Error.prototype))
    Object.defineProperty(Error.prototype, 'toJSON', {
        value: function () {
            var alt = {};
    
            Object.getOwnPropertyNames(this).forEach(function (key) {
                alt[key] = this[key];
            }, this);
    
            return alt;
        },
        configurable: true,
        writable: true
    });
}
