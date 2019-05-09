"use strict";
const express = require('express');  
const router = express.Router();
const xlsx = require('xlsx');  

const data = require('../manager/data');
const constData = require('../utility/constData');  
const response = constData.response;
const getResTemp = constData.getResTemp;

router.all("/",(req,res,next)=>{
    console.log(req.baseUrl+'(all)');
    next();
});

router.post("/:filesName",(req,res)=>{
    let files=null;
    let p=null;
    try{
        files = req.files[0].buffer;
        const excel = xlsx.read(files);
        if(req.params.filesName!=null){
            switch(req.params.filesName){
                case 'tempData':
                    p = uploadTempData(excel);
                    break;
                case 'playerData':
                    p = uploadPlayerData(excel);
                    break;
                default:
                    p= new Promise((resolve,reject)=>{return reject("url(filesName) invalid")});
            }
            p.then(_=>{
                res.json(getResTemp(response.successful));
            }).catch(error=>{
                res.json(getResTemp(response.uploadError,error));
            })
        }
        else{
            res.json(getResTemp(response.uploadError,"filesName is null"));
        }
        
    }
    catch(error){
        console.error(error);
        res.json(getResTemp(response.uploadError,error));
        return;
    }
    
    

});

/**
 * 上傳固定資料
 * @param {*} excel 
 */
function uploadTempData(excel){
    let pArray=[];
    let tempSheets=['carddata','taskdata'];
    tempSheets.forEach(e=>{
        let sheet = excel.Sheets[e];
        if(sheet==null) return;
        let sheetArray = xlsx.utils.sheet_to_json(sheet,{ defval:null});
        let p = data.updateTempData(sheetArray,e);
        pArray.push(p);
    });
    return Promise.all(pArray);
}

/**
 * 上傳玩家資料 會清空原本資料
 * @param {*} excel 
 */
function uploadPlayerData(excel){
    let sheetArray = xlsx.utils.sheet_to_json(excel.Sheets[excel.SheetNames[0]],{ defval:null});
    let p = data.updateTempData(sheetArray,excel.SheetNames[0])
    return p;
}

module.exports={
    router:router
}