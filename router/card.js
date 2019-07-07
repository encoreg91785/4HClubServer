"use strict";
const express = require('express');
const router = express.Router();
const mysql = require('../manager/mysql');
const dataMg = require('../manager/data');

const constData = require('../utility/constData');
const response = constData.response;
const getResTemp = constData.getResTemp;
const stringIsNullOrEmpty = constData.stringIsNullOrEmpty;

router.all("/", (req, res, next) => {
    console.log(req.baseUrl + '(all)');
    next();
});

/**
 * key cardArray:array[]
 * key playerqrcode
 * 新增卡片
 */
router.post("/", (req, res) => {
    let playerArrayr = req.body.playerqrcode;
    let cardid = req.body.cardid;
    let from = req.body.from;
    let confirm = req.body.confirm;
    let c = dataMg.cardData[cardid];
    if (playerArrayr != null && playerArrayr.length > 0 && stringIsNullOrEmpty(cardid)) {
        let dataArray = [];
        let pls = [];
        playerArrayr.forEach(e => {
            if (c.max == 0) {
                let p = mysql.modules.card.count({ where: { playerqrcode: e, cardid: cardid } }).then(result => {
                    if (result == 0) {
                        let d = { playerqrcode: e, cardid: cardid, create: Date.now(), from: from, confirm: confirm };
                        dataArray.push(d);
                    }
                });
                pls.push(p);
            }
            else if (c.max == -1) {
                let d = { playerqrcode: e, cardid: cardid, create: Date.now(), from: from, confirm: confirm };
                dataArray.push(d);
            }
            else {
                let p = mysql.modules.card.count({ where: {cardid: cardid } }).then(result => {
                    if (result < c.max) {
                        let d = { playerqrcode: e, cardid: cardid, create: Date.now(), from: from, confirm: confirm };
                        dataArray.push(d);
                    }
                });
                pls.push(p);
            }
        });

        
        Promise.all(pls).then(()=>{
            mysql.modules.card.bulkCreate(dataArray).then(_ => {
                res.json(getResTemp(response.successful));
            }).catch(error => {
                res.json(getResTemp(response.createError, error));
            });
        })
    }
    else {
        res.json(getResTemp(response.createError, "params invalid"));
    }
});

/**
 * key playerqrcode
 * 取得玩家所卡片資料
 */
router.get("/", (req, res) => {
    let playerqrcode = req.query.playerqrcode;
    if (stringIsNullOrEmpty(playerqrcode)) {
        mysql.modules.card.findAll({ where: { playerqrcode: playerqrcode, submit: null } }).then(result => {
            res.json(getResTemp(response.successful, result));
        }).catch(error => {
            res.json(getResTemp(response.getError, error));
        });
    }
    else {
        res.json(getResTemp(response.getError, "player qrcode is null or Empty"));
    }
});

router.get("/all", (req, res) => {
    mysql.modules.card.findAll().then(result => {
        res.json(getResTemp(response.successful, result));
    }).catch(error => {
        res.json(getResTemp(response.getError, error));
    });
});

/**
 * 取得卡片數量
 */
router.get("/count", (req, res) => {
    let playerqrcode = req.query.playerqrcode;
    let cardid = req.query.cardid;
    mysql.modules.card.count({ where: { playerqrcode: playerqrcode, cardid: cardid } }).then(result => {
        res.json(getResTemp(response.successful, result));
    })
})

/**
 * 拿取實際卡片
 */
router.put("/", (req, res) => {
    let cardid = req.query.cardid;
    if (cardid != null && cardid.length > 0) {
        mysql.modules.card.update({ submit: Date.now() }, {
            where: {
                id: { [mysql.op.in]: cardid },
            }
        }).then(result => {
            if (result > 0) res.json(getResTemp(response.successful, result));
            else res.json(getResTemp(response.updateError, "effect result is zero"));
        }).catch(error => {
            res.json(getResTemp(response.updateError, error));
        })
    }
    else {
        res.json(getResTemp(response.updateError, "cardid is null or Empty or type is not array"));
    }
});

router.delete("/", (req, res) => {
    res.send("delete");
});

module.exports = {
    router: router
}