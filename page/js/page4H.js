"use strict";
new Vue({
	el:'#app',
	data:{
        logadTitle:"大帥哥你好",
        isShow:false,
        isShowMessage:false,
        isLoading:false,
        isOneButton:false,

        loadingTitle:"Titledfasdfasdf",
        loadingMessage:"asdfasdfasdfassssssssssssssssssssssssdf",
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
    }
});