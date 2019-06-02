"use strict";
Vue.component('player_item',{
    props:['e','func'],
    template:'#player_item',
    data:function(){
        return{
            content:[],
        }
    }
})

Vue.component('card_item',{
    props:['e','func'],
    template:'#card_item',
    data:function(){
        return{
            content:[],
        }
    }
})

Vue.component('task_item',{
    props:['e','func'],
    template:'#task_item',
    data:function(){
        return{
            content:[],
        }
    }
})

Vue.component('cardTemp_item',{
    props:['e','func'],
    template:'#cardTemp_item',
    data:function(){
        return{
            content:[],
        }
    }
})

Vue.component('taskTemp_item',{
    props:['e','func'],
    template:'#taskTemp_item',
    data:function(){
        return{
            content:[],
        }
    }
})

let v = new Vue({
	el:'#app',
	data:{
        //顯示相關
        isShowAll:false,
        isShow:false,
        isShowMessage:false,
        isLoading:false,
        isOneButton:false,
        isShowButton:true,
        isShowUpload :false,

        //模板資料
        cardTemp:{},
        taskTemp:{},

        //上傳檔案資料
        tempFile:null,
        playerFile:null,
        //應該使用的template 名稱
        temp:'player_item',

        //內容的其他方法(EX:篩選條件等等)
        extraEvent:[{func:()=>{ alert('func')},name:'func'}],
        
        //內容的標題
        title:['aa','vv','dd','ee'],

        //template的傳入值
        func:null,
        content:[
            {rank:1,name:'b',team:'b',total:10},
        ],

        //訊息框內容跟標題按鈕的方法
        loadTitle:"",
        loadingMessage:"",
        oneButtonClick:()=>{alert("one")},
        twoButtonClick:()=>{alert("two")},
    },
    mounted:function(){
        loadTempData().finally(_=>{
            this.isShowAll = true;
        });
    },
    methods: {
        
        player:function(){
            loading();
            axios.get("/player/all").then(res=>{
                closeLoading();
                if(res.data!=null)updateHtmlTemplate(res.data.data,'player_item');
                this.extraEvent=[];
            }).catch(error=>{
                this.onMessage(true,"錯誤發生","錯誤訊息:"+error,false,[closeLoading]);
            });
        },

        card:function(){
            loading();
            axios.get("/card/all").then(res=>{
                closeLoading();
                if(res.data!=null)updateHtmlTemplate(res.data.data,'card_item');
                this.extraEvent=[{func:this.card,name:'已獲得卡牌'},{name:"卡牌列表",func:setCradTemplate}];
            }).catch(error=>{
                this.onMessage(true,"錯誤發生","錯誤訊息:"+error,false,[closeLoading]);
            });
        },

        task:function(){
            loading();
            axios.get("/task/all").then(res=>{
                closeLoading();
                this.extraEvent=[{func:this.task,name:'已完成任務'},{name:"任務列表",func:setTaksTemplate}];
                if(res.data!=null)updateHtmlTemplate(res.data.data,'task_item');
            }).catch(error=>{
                this.onMessage(true,"錯誤發生","錯誤訊息:"+error,false,[closeLoading]);
            });
        },

    	uploadExcel: function() {
            let enter =()=>{
                let p=[];
                if(this.tempFile!=null)p.push(uploadTempData(this.tempFile));
                if(this.playerFile!=null)p.push(uploadPlayerData(this.playerFile));
                if(p.length>0){
                    let msg="";
                    let title=null;
                    this.onMessage(true,"上傳中","請稍後",true);
                    Promise.all(p).then(result=>{
                        
                        result.forEach(e=>{
                            if(e.data.result!='successful')msg += e.datat.data;
                        })
                        if(msg==""){
                            title = "成功";
                            msg = "上傳完成"
                            return loadTempData();
                        }
                        else{
                            title = "上傳失敗請查看相關訊息";
                        }
                        
                        
                    }).then(_=>{
                        this.onMessage(true,title,msg,false,[()=>{ closeLoading();restetFile();}])
                    })
                }
                else{
                    alert("請選取資料");
                } 
            };
            let cancel=()=>{
                restetFile();
                this.onMessage(false);
            };
            this.onMessage(true,"上傳檔案","請選擇EXCEL檔案",false,[enter,cancel],true);
        },
        // #region File資料修改
        setPlayerFile:function(){
            this.playerFile = this.$refs.playerData.files[0];
        },

        setTempFile:function(){
            this.tempFile = this.$refs.tempData.files[0];
        },
        // #endregion

        /**
         * 
         * @param {boolean} on 是否顯示訊息
         * @param {string} title 標題
         * @param {string} ms 訊息
         * @param {bool} onImg 讀取中的圖
         * @param {function[]} btnFunc 按鈕的方法(兩個以內0:確定 1:取消)
         * @param {boolean} showUpload 預設不顯示上傳檔案按鈕
         */
        onMessage:function(on,title,ms,onImg,btnFunc,showUpload = false){
            this.isShow=on;
            if(on==false)return;
            this.loadTitle=title;
            this.isShowMessage = ms!=null;
            this.loadingMessage =ms||'';
            this.isLoading =onImg;
            this.isShowUpload = showUpload;
            if(btnFunc!=null){
                if(btnFunc.length>=1) this.oneButtonClick = btnFunc[0];
                if(btnFunc.length==2) this.twoButtonClick = btnFunc[1];
                this.isOneButton = btnFunc.length==1;
                this.isShowButton = true;
            }
            else
            {
                this.twoButtonClick = ()=>{};
                this.oneButtonClick = ()=>{};
                this.isShowButton = false;
            } 
        },
    }
});

let to=null;
function loading(){
    to = setTimeout(()=>{
        v.onMessage(true,"訊息","請稍後",true);
        to = null;
    },500); 
}

function closeLoading(){
    if(to!=null){
        clearTimeout(to);
        to=null;
    }
    else v.onMessage(false);
}

function setTaksTemplate(){
    updateHtmlTemplate(Object.values(v.taskTemp),'taskTemp_item')
}

function setCradTemplate(){
    updateHtmlTemplate(Object.values(v.cardTemp),'cardTemp_item');
}

function restetFile(){
    v.tempFile=null;
    v.playerFile=null;
    v.$refs.tempData.type = 'text';
    v.$refs.tempData.type = 'file';
    v.$refs.playerData.type = 'text';
    v.$refs.playerData.type = 'file';
}

function updateHtmlTemplate(reqData,temp){
    if(reqData==null){
        alert("取得內容為空");
    }
    else{
        v.temp = temp;
        v.content = reqData;
        if(reqData.length>0)v.title = Object.keys(reqData[0]);
        else v.title=['無資料'];
    }
}

function uploadTempData(file){
    var data= new FormData();
    data.append("temp",file);
    return axios.post('/uploadExcel/tempData',data,{header:{'Content-Type':'multipart/form-data'}});
}

function uploadPlayerData(file){
    var data= new FormData();
    data.append("player",file);
    return axios.post('/uploadExcel/playerData',data,{header:{'Content-Type':'multipart/form-data'}});
}

function loadTempData(){
    return axios.get("/temp").then(res=>{
        v.cardTemp = res.data.data.card;
        v.taskTemp = res.data.data.task;
    }).catch(error=>{
        v.onMessage(true,"錯誤發生","錯誤訊息:"+error,false,[closeLoading]);
    });
}