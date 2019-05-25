"use strict";
const Sequelize = require('sequelize');
const constantData = require('../utility/constData');
let sequelize= null;
/**
 * 資料庫物件
 */
let modules={};

function connect(database,userName,password,option){
    return new Promise((resolve) => {
        const defaultOption = { host: 'localhost',dialect: 'mysql'};
        option = option||defaultOption;
        testConnect(database,userName,password,option).then(()=>{
            sequelize = new Sequelize(database,userName,password,option);
            let p =loadTables(constantData.defineTables);
            return p;
        }).then(_=>{
            return resolve();
        });
        
    }).catch(err=>{
        console.error('Unable to connect to the database:', err);
    });
}    

/**
 * 測試連線
 * @param {string} database schema名稱
 * @param {string} userName 帳號
 * @param {string} password 密碼
 * @param {Object} option 相關設定
 */
function testConnect(database,userName,password,option){
    let testConnect = new Sequelize(null,userName,password,option);
    return testConnect.query("create schema if not exists "+ database +";").then(_=>{
        testConnect.close();
        console.log('Connection has been '+ database +'successfully.');
    });
}

/**
 * 導入MySQL表單與格式
 * @param {Object} tables { table:Object option:Object }
 */
function loadTables(tables){
    let p =[];
    Object.keys(tables).forEach(tableName=>{
        let option = tables[tableName].option||{timestamps: false,freezeTableName: true};
        modules[tableName]=sequelize.define(tableName,tables[tableName].table,option);
        p.push(modules[tableName].sync());
    })
    return Promise.all(p);
}

module.exports.op=Sequelize.Op;
module.exports.modules=modules;
module.exports.connect=connect;