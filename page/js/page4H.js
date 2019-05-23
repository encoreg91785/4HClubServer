"use strict";
Vue.component('player_item',{
    props:['e','func'],
    template:'#player_item',
    data:function(){
        return{content:[{title:'a'},{title:'b'},{title:'b'},{title:'b'}],
        aaaaa:()=>{return "asdfasdf"}
    }
    }
})

new Vue({
	el:'#app',
	data:{
        logadTitle:"大帥哥你好",
        isShow:true,
        isShowMessage:true,
        isLoading:true,
        isOneButton:false,

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
        loadingTitle:"Titledfasdfasdf",
        loadingMessage:"asdfasdfasdfassssssssssssssssssssssssdf",
        oneButtonClick:()=>{alert("one")},
        twoButtonClick:()=>{alert("two")},
    },
    mounted:function(){

    },
    methods: {
    	upload: function() {
            this.isShow=!this.isShow;
            this.isLoading=!this.isLoading;
            this.isOneButton=!this.isOneButton;
            this.isShowMessage=!this.isShowMessage;
        },

        /**
         * 
         * @param {bool} on 是否顯示訊息
         * @param {string} title 標題
         * @param {string} ms 訊息
         * @param {bool} onImg 讀取中的圖
         * @param {function[]} btnFunc 按鈕的方法(兩個以內0:確定 1:取消)
         */
        onMessage:function(on,title,ms,onImg,btnFunc){
            if(on==false){
                this.isShowMessage=on;
                return;
            }
            this.logadTitle=title;
            this.isShowMessage = ms!=null;
            this.loadingMessage =ms;
            this.isLoading =onImg;
            if(btnFunc!=null){
                if(btnFunc.length>=1) this.oneButtonClick = btnFunc[0];
                if(tnFunc.length==2)this.twoButtonClick = btnFunc[1];
                this.isOneButton = tnFunc.length==2;
            }
            else alert("btn func is null");
        },
    }
});