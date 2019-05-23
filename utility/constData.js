"use strict";
const Sequelize = require('sequelize');

/**
 * 回傳值
 */
module.exports.response={
    successful:'successful',
    uploadError:'uploadError',
    createError:'createError',
    updateError:'updateError',
    getError:'getError',
}

/**
 * 資料庫定義
 */
module.exports.defineTables={
    player:{
        table:{
            qrcode:{type:Sequelize.STRING(50),primaryKey: true,allowNull: false,unique: true},
            name:{type:Sequelize.STRING(50),allowNull: false},
            team:{type:Sequelize.STRING(50),allowNull: true},
            update:{type:Sequelize.DATE,allowNull: true},
        },
        option:null,
    },
    taskdata:{
        table:{
            qrcode:{type:Sequelize.STRING(50),allowNull: false,unique: true,primaryKey: true},
            cardqrcode:{type:Sequelize.STRING(50),allowNull: false},
            type:{type:Sequelize.STRING(50),allowNull: true},
            name:{type:Sequelize.STRING(50),allowNull: false},
            condition:{type:Sequelize.STRING,allowNull: false},
            information:{type:Sequelize.STRING,allowNull: false},
        },
        option:null,
    },
    carddata:{
        table:{
            qrcode:{type:Sequelize.STRING(50),allowNull: false,unique: true,primaryKey: true},
            name:{type:Sequelize.STRING(50),allowNull: false},
            type:{type:Sequelize.STRING(50),allowNull: true},
            max:{type:Sequelize.INTEGER,defaultValue:-1},
        },
        option:null,
    },
    card:{
        table:{
            id:{type:Sequelize.INTEGER,primaryKey: true,autoIncrement: true,},
            playerqrcode:{type:Sequelize.INTEGER,allowNull: false},
            cardqrcode:{type:Sequelize.STRING(50),allowNull: false},
            create:{type:Sequelize.DATE,allowNull: false},
        },
        option:null,
    },
    task:{
        table:{
            id:{type:Sequelize.INTEGER,primaryKey: true,autoIncrement: true,},
            playerqrcode:{type:Sequelize.STRING(50),allowNull: false},
            taskqrcode:{type:Sequelize.STRING(50),allowNull: false},
            submit:{type:Sequelize.DATE,allowNull: true},
            create:{type:Sequelize.DATE,allowNull: false},
        },
        option:null,
    }
}

/**
 * 取得回傳用的模板{result:result,data:data}
 * @param {string} result 
 * @param {string} data 
 */
module.exports.getResTemp=function(result,data)
{
    return {result:result,data:data};
}

/**
 * 判斷是否為字串並且不為空或是Null
 */
module.exports.stringIsNullOrEmpty=function(s){
    return s!=null&&typeof s === 'string'&&s.trim()!=''
}