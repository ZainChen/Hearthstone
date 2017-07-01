//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {

    //志银的自定义类
    /*
    private touchHandler( evt:egret.TouchEvent ):void{
        var tx:egret.TextField = evt.currentTarget;
        tx.textColor = 0x00ff00; 
    }
    */
    private times:number;

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin

            context.onUpdate = () => {
                console.log('hello,world')
            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }


        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("heroes");  //加载资源组
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent) {
        if (event.groupName == "heroes") {  //判断所加载的资源是哪个资源组
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();  //资源组加载完成
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield: egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        //插入 log
        console.log("志银");
        var bg:egret.Shape = new egret.Shape(); //首先建立一个egret.Shape对象bg，这是由于egret.Shape对象有图形绘制功能。我们要绘制的背景的工作就用这个对象来完成。
        bg.graphics.beginFill(0x000000);  //在绘制前，定义图形的填充颜色
        bg.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight); 
        bg.graphics.endFill();  //endFill用来结束绘制工作。
        super.addChild( bg );  //这是Egret引擎操作显示列表的一个最常用的方法，就是将某个显示对象添加到某个显示容器上

        
        var tx:egret.TextField = new egret.TextField();
        tx.text = "I'm ZainChen, I will use Egret create a fantasy mobile game!"; 
        tx.size = 32;
        tx.x = 20;
        tx.y = 20;
        tx.width = this.stage.stageWidth - 40;
        this.addChild( tx );
        

        tx.touchEnabled = true;  //允许该显示对象响应Touch事件
        //tx.addEventListener( egret.TouchEvent.TOUCH_TAP, this.touchHandler, this ); //新增一个方法的引用，这就是事件处理函数，我们需要事件处理函数中对用户操作做出对应的反应
        tx.addEventListener( egret.TouchEvent.TOUCH_TAP,
            function( evt:egret.TouchEvent ):void{    
            tx.textColor = 0x00ff00; 
        }, this );   

        var batman7:egret.Bitmap = new egret.Bitmap( RES.getRes("bg7_jpg") );
        batman7.x = 0;
        batman7.y = 0;
        console.log(batman7.$getHeight);
        this.addChild( batman7 );
        console.log( "createGameScene", RES.getRes("bg7_jpg") );  //查看bg.jpg是否加载成功

        var batman6:egret.Bitmap = new egret.Bitmap( RES.getRes("bg6_jpg") );
        batman6.x = 0;
        batman6.y = 0;
        console.log(batman6.$getHeight);
        this.addChild( batman6 );
        console.log( "createGameScene", RES.getRes("bg6_jpg") );  //查看bg.jpg是否加载成功

        var batman5:egret.Bitmap = new egret.Bitmap( RES.getRes("bg5_jpg") );
        batman5.x = 0;
        batman5.y = 0;
        console.log(batman5.$getHeight);
        this.addChild( batman5 );
        console.log( "createGameScene", RES.getRes("bg5_jpg") );  //查看bg.jpg是否加载成功

        var batman4:egret.Bitmap = new egret.Bitmap( RES.getRes("bg4_jpg") );
        batman4.x = 0;
        batman4.y = 0;
        console.log(batman4.$getHeight);
        this.addChild( batman4 );
        console.log( "createGameScene", RES.getRes("bg4_jpg") );  //查看bg.jpg是否加载成功
        
        var batman3:egret.Bitmap = new egret.Bitmap( RES.getRes("bg3_jpg") );
        batman3.x = 0;
        batman3.y = 0;
        console.log(batman3.$getHeight);
        this.addChild( batman3 );
        console.log( "createGameScene", RES.getRes("bg3_jpg") );  //查看bg.jpg是否加载成功

        var batman2:egret.Bitmap = new egret.Bitmap( RES.getRes("bg2_jpg") );
        batman2.x = 0;
        batman2.y = 0;
        console.log(batman2.$getHeight);
        this.addChild( batman2 );
        console.log( "createGameScene", RES.getRes("bg2_jpg") );  //查看bg.jpg是否加载成功

        var batman1:egret.Bitmap = new egret.Bitmap( RES.getRes("bg1_jpg") );
        batman1.x = 0;
        batman1.y = 0;
        console.log(batman1.$getHeight);
        this.addChild( batman1 );
        console.log( "createGameScene", RES.getRes("bg1_jpg") );  //查看bg.jpg是否加载成功

        var batman:egret.Bitmap = new egret.Bitmap( RES.getRes("bg0_jpg") );
        batman.x = 0;
        batman.y = 0;
        console.log(batman.$getHeight);
        this.addChild( batman );
        console.log( "createGameScene", RES.getRes("bg0_jpg") );  //查看bg.jpg是否加载成功

        

        /*
        batman.anchorOffsetX = 30;
        batman.anchorOffsetY = 40;
        batman.x += 30;
        batman.y += 40;
        */
        /*
        this.stage.addEventListener( egret.TouchEvent.TOUCH_TAP, function(){ 
            switch ( ++ self.times % 3 ) {
                case 0: egret.Tween.get( batman ).to( { x:50 }, 300, egret.Ease.circIn ); break; 
                case 1: break; 
                case 2: break; 
            } 
        }, this );
        */

        this.times = -1;
        var self = this;
        //创建一个计时器对象
        var timer:egret.Timer = new egret.Timer(2000,5);
        //注册事件侦听器
        timer.addEventListener(egret.TimerEvent.TIMER, function(){ 
            egret.Tween.get( batman ).to( { x:700 }, 300, egret.Ease.circIn );
        }, this );
        //timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,this.timerComFunc,this);
        //开始计时
        timer.start();

        var timer:egret.Timer = new egret.Timer(3500,5);
        timer.addEventListener(egret.TimerEvent.TIMER, function(){ 
            egret.Tween.get( batman1 ).to( { x:-700 }, 300, egret.Ease.circIn );
        }, this );
        timer.start();

        var timer:egret.Timer = new egret.Timer(5000,5);
        timer.addEventListener(egret.TimerEvent.TIMER, function(){ 
            egret.Tween.get( batman2 ).to( { y:800 }, 300, egret.Ease.circIn );
        }, this );
        timer.start();

        var timer:egret.Timer = new egret.Timer(6500,5);
        timer.addEventListener(egret.TimerEvent.TIMER, function(){ 
            egret.Tween.get( batman3 ).to( { y:-800 }, 300, egret.Ease.circIn );
        }, this );
        timer.start();

        var timer:egret.Timer = new egret.Timer(8000,5);
        timer.addEventListener(egret.TimerEvent.TIMER, function(){ 
            egret.Tween.get( batman4 ).to( { x:700 }, 300, egret.Ease.circIn );
        }, this );
        timer.start();

        var timer:egret.Timer = new egret.Timer(9500,5);
        timer.addEventListener(egret.TimerEvent.TIMER, function(){ 
            egret.Tween.get( batman5 ).to( { x:-700 }, 300, egret.Ease.circIn );
        }, this );
        timer.start();

        /*
        var timer:egret.Timer = new egret.Timer(10500,5);
        timer.addEventListener(egret.TimerEvent.TIMER, function(){ 
            egret.Tween.get( batman6 ).to( { y:800 }, 300, egret.Ease.circIn );
        }, this );
        timer.start();
        */

        this.stage.addEventListener( egret.TouchEvent.TOUCH_TAP, function(){ 
             egret.Tween.get( batman6 ).to( { y:800 }, 300, egret.Ease.circIn );
        }, this );
    }
}


