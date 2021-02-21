const TAG = "MainScene";
var CurLevel = 1;
var MaxLevel = 100;
var LevelDataList = [
    {
        title: "这是什么物品",
        a1: "车子",
        a2: "房子",
        a3: "椅子",
        a4: "瓶子",
    },
    {
        title: "图中是什么图形",
        a1: "圆形",
        a2: "矩形",
        a3: "正方形",
        a4: "椭圆形",
    },
];
var LevelList = [];
var answerIndex = 1;
let redTex = null;
cc.loader.loadRes("image/red", function(err, tex){
    if (err == null){
        redTex = tex;
    }
});
let greenTex = null;
cc.loader.loadRes("image/green", function(err, tex){
    if (err == null){
        greenTex = tex;
    }
});
let yellowTex = null;
cc.loader.loadRes("image/yellow", function(err, tex){
    if (err == null){
        yellowTex = tex;
    }
});
cc.loader.loadRes("config/level", function(err, data){
    console.log("7383   ===== ", err, data);
    if (err == null){
        LevelDataList = data.json;
        console.log("level length=", LevelDataList.length);
    }
});

function random(lower, upper) {
    return Math.floor(Math.random() * (upper - lower+1)) + lower;
}

cc.Class({
    extends: cc.Component,
    properties: {
        mask: {
            default: null,
            type: cc.Mask,
            tooltip: "需要刮开的",
        },
        picSprite: {
            default: null,
            type: cc.Sprite,
        },
        moneyLabel:{
            default: null,
            type: cc.Label,
        },
        progressBar1: {
            default: null,
            type: cc.Sprite,
        },
        progressBar1Front: {
            default: null,
            type: cc.Sprite,
        },
        progressBar1After: {
            default: null,
            type: cc.Sprite,
        },
        hintSprite: {
            default: null,
            type: cc.Sprite,
        },
        passLabel: {
            default: null,
            type: cc.Label,
        },
        progressBar2: {
            default: null,
            type: cc.Sprite,
        },
        progressBar2Front: {
            default: null,
            type: cc.Sprite,
        },
        progressBar2After: {
            default: null,
            type: cc.Sprite,
        },
        star1: {
            default: null,
            type: cc.Sprite,
        },
        star2: {
            default: null,
            type: cc.Sprite,
        },
        star3: {
            default: null,
            type: cc.Sprite,
        },
        nextBtn: {
            default: null,
            type: cc.Button,
        },    
        titleSprite: {
            default: null,
            type: cc.Sprite,
        },
        titleLabel: {
            default: null,
            type: cc.Label,
        }, 
        answerBtn1: {
            default: null,
            type: cc.Button,
        },
        btnBackground1:{
            default: null,
            type: cc.Sprite,
        },
        btn1Label: {
            default: null,
            type: cc.Label,
        },
        answerBtn2: {
            default: null,
            type: cc.Button,
        },
        btnBackground2:{
            default: null,
            type: cc.Sprite,
        },
        btn2Label: {
            default: null,
            type: cc.Label,
        },
        answerBtn3: {
            default: null,
            type: cc.Button,
        },
        btnBackground3:{
            default: null,
            type: cc.Sprite,
        },
        btn3Label: {
            default: null,
            type: cc.Label,
        },
        answerBtn4: {
            default: null,
            type: cc.Button,
        },
        btnBackground4:{
            default: null,
            type: cc.Sprite,
        },
        btn4Label: {
            default: null,
            type: cc.Label,
        },
        scrapteRadiusX: {
            default: 20.0,
            type: cc.Float,
            tooltip: "绘制点图形的x轴半径"
        },
        scrapteRadiusY: {
            default: 22.0,
            type: cc.Float,
            tooltip: "绘制点图形的y轴半径"
        },
        scrapteArea:{
            default: 0.5,
            type: cc.Float,
            tooltip: "需要刮开的图层面积的多少"
        },
        scrapeEvents:{
            default: [],
            type: [cc.Component.EventHandler],
            tooltip: "擦除完成出发事件"
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var self =  this;
        this.nextBtn.node.on("click", this.onNextBtn, this);
        this.answerBtn1.node.on("click", this.onAnswerBtn1, this);
        this.answerBtn2.node.on("click", this.onAnswerBtn2, this);
        this.answerBtn3.node.on("click", this.onAnswerBtn3, this);
        this.answerBtn4.node.on("click", this.onAnswerBtn4, this);

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegin, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    },
    getInitNum(){
        this.pixelNum = 0;
        this.achieveNum = this.scrapteArea * this.initPixel();
    },
    initPixel(){
        this.scrapeNode = this.mask.node.children[0];
        cc.log("this.scrapeNode ", this.mask.node.children.length);
        var x = this.scrapeNode.width, y = this.scrapeNode.height;
        console.log("x=", x, "y=", y);
        this.node.width = x;
        this.node.height = y;
        this.widthWide= x/2 + 20;
        this.heightWide = x/2 + 20;
        var zx = x/2, zy=y/2, dx = -zx, dy = -zy, dy1 = dy;
        var pixelPoint = [];
        var rx = this.scrapteRadiusX*2;
        var ry = this.scrapteRadiusY*2;

        for(; dx <= zx; dx += rx)
        {
            for(dy = dy1; dy <= zy; dy += ry)
            {
                var p = [dx, dy];
                p.isTouch = true;
                pixelPoint.push(p);
            }
        }
        this.pixelPoint = pixelPoint;
        return pixelPoint.length;
    },
    updateData()
    {
        var self = this;
        this.passLabel.string = "第" + CurLevel + "关";
        var levelData = LevelDataList[LevelList[CurLevel-1]];
        this.titleLabel.string = levelData.title;
        answerIndex = random(1, 4);
        console.log("正确答案 ：", answerIndex);
        this.btn1Label.string = levelData.a1;
        this.btn2Label.string = levelData.a2;
        this.btn3Label.string = levelData.a3;
        this.btn4Label.string = levelData.a4;
        if (answerIndex == 2){
            this.btn1Label.string = levelData.a2;
            this.btn2Label.string = levelData.a1;            
        }else if (answerIndex == 3){
            this.btn1Label.string = levelData.a3;
            this.btn3Label.string = levelData.a1;  
        }else if (answerIndex == 4){
            this.btn1Label.string = levelData.a4;
            this.btn4Label.string = levelData.a1;  
        }
        this.titleSprite.node.active = true;
        this.nextBtn.node.active = false;
        this.btnBackground1.spriteFrame = new cc.SpriteFrame(yellowTex);
        this.btnBackground2.spriteFrame = new cc.SpriteFrame(yellowTex);
        this.btnBackground3.spriteFrame = new cc.SpriteFrame(yellowTex);
        this.btnBackground4.spriteFrame = new cc.SpriteFrame(yellowTex);
        this.getInitNum();

        this.progressBar2.fillRange = 1;
        this.progressBar2After.node.active = true;
        this.progressBar2Front.node.active = true;
        this.star1.node.active = true;
        this.star2.node.active = true;
        this.star3.node.active = true;
        let graphics = this.mask._graphics;
        graphics.clear();
        cc.loader.loadRes("pic/"+String(levelData.id), function(err, tex){
            console.log("加载图片", err, tex, "pic/"+String(levelData.id));
            if (err == null){
                self.picSprite.spriteFrame = new cc.SpriteFrame(tex);
            }
        });
    },
    start () {
        for (let i = 0; i < MaxLevel; ++i){
            LevelList.push(i);
        }
        let idx;
        let tmp;
        for (let i = 0; i < LevelList.length; ++i){
            idx = random(i, LevelList.length-1);
            tmp = LevelList[i];
            LevelList[i] = LevelList[idx];
            LevelList[idx] = tmp;
            console.log("levelList[i] = ", LevelList[i]);
        }
        this.moneyLabel.string = 0;
        this.progressBar1.fillRange = 0;
        this.progressBar1Front.node.active = false;
        this.progressBar1After.node.active = false;
        this.progressBar2.fillRange = 1;
        this.nextBtn.node.active = false;
        this.updateData();
    },
    endScape()
    {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchBegin, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    },
    // update (dt) {},
    onDestroy: function()
    {
        this.endScape();
    },
    onNextBtn: function(){
        console.log("onNextBtn ", CurLevel, LevelDataList.length);
        CurLevel++;
        if (CurLevel > MaxLevel)
        {
            console.log("题目做完了");
            return;
        }
        this.updateData();
    },
    onAnswerBtn1: function(){
        cc.log("onAnswerBtn1");
        if (answerIndex == 1)
        {
            this.handleRight(1);
        }
        else
        {
            this.handleError(1);
        }
    },
    onAnswerBtn2: function(){
        cc.log("onAnswerBtn2");
        if (answerIndex == 2)
        {
            this.handleRight(2);
        }
        else
        {
            this.handleError(2);
        }
    },
    onAnswerBtn3: function(){
        cc.log("onAnswerBtn3");
        if (answerIndex == 3)
        {
            this.handleRight(3);
        }
        else
        {
            this.handleError(3);
        }
    },
    onAnswerBtn4: function(){
        cc.log("onAnswerBtn4");
        if (answerIndex == 4)
        {
            this.handleRight(4);
        }
        else
        {
            this.handleError(4);
        }
    },
    handleRight(index){
        this.progressBar1.fillRange += 0.1;
        this.nextBtn.node.active = true;
        this.titleSprite.node.active = false;
        if (1 == index){
            this.btnBackground1.spriteFrame = new cc.SpriteFrame(greenTex);
        }else if(2 == index){
            this.btnBackground2.spriteFrame = new cc.SpriteFrame(greenTex);
        }else if(3 == index){
            this.btnBackground3.spriteFrame = new cc.SpriteFrame(greenTex);
        }else if(4 == index){
            this.btnBackground4.spriteFrame = new cc.SpriteFrame(greenTex);
        }
    },
    handleError(index){
        this.nextBtn.node.active = true;
        this.titleSprite.node.active = false;
        if (1 == index){
            this.btnBackground1.spriteFrame = new cc.SpriteFrame(redTex);
        }else if(2 == index){
            this.btnBackground2.spriteFrame = new cc.SpriteFrame(redTex);
        }else if(3 == index){
            this.btnBackground3.spriteFrame = new cc.SpriteFrame(redTex);
        }else if(4 == index){
            this.btnBackground4.spriteFrame = new cc.SpriteFrame(redTex);
        }
    },
    onTouchBegin: function(event){
        cc.log("touch begin");
        //this.comFunc(event);
    },
    onTouchMove: function(event){
        cc.log("touch move");
        this.comFunc(event);
    },
    onTouchEnd: function(event){
        cc.log("touch end");
        this.checkScrape();
        this.comFunc(event);
    },
    onTouchCancel: function(event){
        cc.log("touch cancel");
        this.checkScrape();
    },
    checkScrape(){
        cc.log("目标数是：" + this.achieveNum);
        cc.log("现在已经刮开"+this.pixelNum);
        if (this.achieveNum <= this.pixelNum){
            cc.log("已经刮完图层");
            //this.achieveScrape();
        }
        console.log("使用的比例：", this.pixelNum/this.achieveNum);
        this.progressBar2.fillRange = this.progressBar2.fillRange - this.pixelNum/this.achieveNum;
        if (this.progressBar2.fillRange <= 0.01)
            this.progressBar2Front.node.active = false;
        if (this.progressBar2.fillRange <= 0.24){
            this.star3.node.active = false;
            this.star2.node.active = false;
            this.star1.node.active = false;
        }else if (this.progressBar2.fillRange <= 0.52){
            this.star2.node.active = false;
            this.star1.node.active = false;
        }else if (this.progressBar2.fillRange <= 0.8)
            this.star1.node.active = false;
        this.progressBar2After.node.active = false;
        cc.log("this.scrapteRadiusX = " + this.scrapteRadiusX);
        cc.log("this.scrapteRadiusY = " + this.scrapteRadiusY);
    },
    getPos(e){
        var point = e.touch.getLocation();
        point = this.node.convertToNodeSpaceAR(point);
        return point;
    },
    comFunc(event)
    {
        var point = this.getPos(event);
        this.checkPixelPoint(point);
        this._addCircle(point);
    },
    checkPixelPoint(point){
        var pixelPoint = this.pixelPoint;
        var x, y;
        for (var i in pixelPoint){
            x = Math.abs(point.x - pixelPoint[i][0]);
            y = Math.abs(point.y - pixelPoint[i][1]);
            if (x <= this.scrapteRadiusX && y <= this.scrapteRadiusY && pixelPoint[i].isTouch)
            {
                pixelPoint[i].isTouch = false;
                this.pixelNum++;
                return;
            }
        }
    },
    _addCircle(point){
        var graphics = this.mask._graphics;
        var color = cc.color(0, 0, 0, 255);
        graphics.lineWidth = 2;
        graphics.fillColor = color;
        graphics.ellipse(point.x, point.y, this.scrapteRadiusX, this.scrapteRadiusY);
        graphics.fill();
    },
    achieveScrape(){
        this.endScape();
        this.node.runAction(cc.fadeOut(0.5));
        this.scheduleOnce((()=>{
            cc.Component.EventHandler.emitEvents(this.scrapeEvents, new cc.Event.EventCustom("scrapeEvents"));
        }).bind(this), 0.6);
    },
});
