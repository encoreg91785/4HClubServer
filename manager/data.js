"use strict";
const mysql = require('./mysql');

/**
 * 卡牌模板
 */
const cardData={};
/**
 * 任務模板
 */
const taskData={};

/**
 * 初始化
 */
 function init(){
    return new Promise((resolve,reject)=>{
        let cardp=mysql.modules.carddata.findAll().then(result=>{
            if(result!=null&&result.length>0){
                result.forEach(e=>{
                    cardData[e['qrcode']]=e;
                });
            }
            else{
                return reject("Data is Null");
            }
        });
        let taskp=mysql.modules.taskdata.findAll().then(result=>{
            if(result!=null&&result.length>0){
                result.forEach(e=>{
                    taskData[e['qrcode']]=e;
                });
            }
            else{
                return reject("Data is Null");
            }
        });
        return resolve(Promise.all([cardp,taskp]));
    })
}

/**
 * 更新模板資料
 * @param {*[]} dataArray 資料Array
 * @param {string} tableName Table名稱
 */
function updateTempData(dataArray,tableName){
    let p;
    if(dataArray!=null&&dataArray.length>0&&['player','carddata','taskdata'].includes(tableName)){
        p = mysql.modules[tableName].sync({force:true}).then(_=>{
            return mysql.modules[tableName].bulkCreate(dataArray).then(result=>{
                console.log(result);            
            });
        });
    }
    else{
        p = new Promise((resolve,reject)=>{return reject("tableName invalid")});
    }
    return p;
}

/**
 * 使用QRCode查詢任務
 * @param {string} qrcode 
 */
function getTaskByQRCode(qrcode){
    return taskData[qrcode];
};

/**
 * 使用QRCode查詢卡牌
 * @param {string} qrcode 
 */
function getCardByQRCode(qrcode){
    return cardData[qrcode];
};
module.exports.cardData=cardData;
module.exports.taskData=taskData;
module.exports.init=init;
module.exports.updateTempData=updateTempData;