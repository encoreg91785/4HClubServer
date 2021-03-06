"use strict";
const net = require('net');
const server = net.createServer();
/**
 * @type {net.Socket[]}
 */
const sockettList = [];
const actionEnum = {
    updatePoint: "UpdatePoint",
    deletePoint: "DeletePoint",
    addPoint: "AddPoint",
    getAllPoint: "GetAllPoint"
}

/**
 * @type {PointData[]}
 */
let pointList = [];
server.on('connection', (socket) => {
    socket.setNoDelay(true);
    sockettList.push(socket);
    console.log('connection');
    socket.on('data', (buf) => {

        let str = buf.toString('utf8');
        console.log(str);
        /**
         * @type {[]}
         */
        let b = str.match(/(\{.+?\})(?={|$)/g);
        b.forEach(e=>{
            parseData(e,socket);
        })

    });

    //連線中斷時
    socket.on('end', () => {
        console.log("end");
    });

    socket.on("close", (isError) => {
        removeElement(sockettList, socket);
        console.log("close");
    })

    socket.on('error', (e) => {
        removeElement(sockettList, socket);
        console.log("error");
        console.log(e);
    });
});

function parseData(str,socket) {
    /**
    * @type {ProtocolData}
    */
    let data = JSON.parse(str);
    if (data != null && data.action != null && data.action != '') {
        switch (data.action) {
            case actionEnum.deletePoint:
                deletePoint(data.data);
                break;
            case actionEnum.updatePoint:
                updatePoint(data.data);
                break;
            case actionEnum.addPoint:
                addPoint(data.data);
                break;
            case actionEnum.getAllPoint:
                getAllPoint(socket);
                break;
            default:
                console.log(data.action + " Does Not Exist");
                break;
        }
    }
}

/**
 * 
 * @param {[]} array 
 * @param {any} ele 
 */
function removeElement(array, ele) {
    var index = array.indexOf(ele);
    if (index > -1) {
        array.splice(index, 1);
        return true;
    }
    return false;
}

/**
 * 
 * @param {PointData} data 
 */
function updatePoint(data) {
    if (data != null && data.id != null) {
        let id = Number(data.id);
        if (id != NaN) {
            let p = findPoint(id);
            if (p != null && removeElement(pointList, p)) {
                pointList.push(data);
                sockettList.forEach(e => {
                    e.write(combineData(actionEnum.updatePoint, data));
                });
            }
        }
    }
}

/**
 * 
 * @param {number} id 
 */
function deletePoint(id) {
    let p = findPoint(id);
    if (p != null && removeElement(pointList, p)) {
        sockettList.forEach(e => {
            e.write(combineData(actionEnum.deletePoint, id));
        });
    }
}

/**
 * 
 * @param {PointData} data 
 */
function addPoint(data) {
    if (data != null & data.id != 0) {
        if (data.id != NaN) {
            let p = findPoint(data.id);
            if (p == null) {
                pointList.push(data);
                sockettList.forEach(e => {
                    e.write(combineData(actionEnum.addPoint, data));
                });
            }
        }
    }

}

/**
 * 
 * @param {net.Socket} socket 
 */
function getAllPoint(socket) {
    socket.write(combineData(actionEnum.getAllPoint, pointList));
}

/**
 * 
 * @param {string} action 
 * @param {*} data
 * @returns {string} 
 */
function combineData(action, data) {
    let d = { action: action, data: data }
    return JSON.stringify(d);
}

/**
 * 
 * @param {number} id 
 */
function findPoint(id) {
    let p = pointList.find(e => {
        return e.id == id;
    })
    return p;
}

/**
* @typedef {Object} ProtocolData
* @property {string} action 服務
* @property {object} data 資訊內容
*/

/**
* @typedef {Object} PointData
* @property {number} id 點的編號
* @property {string} belong 目前所屬
*/

function init() {
    for (let index = 0; index < 9; index++) {
        let data = {id:index,belong:"無"}
        addPoint(data);
    }
    
    server.listen({ port: 1337 }, () => { console.log("Socket Server Run") });//启动监听 
}
module.exports = {
    init: init
}
