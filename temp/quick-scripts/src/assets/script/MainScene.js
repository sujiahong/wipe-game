"use strict";
cc._RF.push(module, 'a5d02MXVNxNwLPWMihCfg0S', 'MainScene');
// script/MainScene.js

"use strict";

var TAG = "MainScene";
var CurLevel = 1;
var MaxLevel = 100;
var LevelDataList = [{
  title: "这是什么物品",
  a1: "车子",
  a2: "房子",
  a3: "椅子",
  a4: "瓶子"
}, {
  title: "图中是什么图形",
  a1: "圆形",
  a2: "矩形",
  a3: "正方形",
  a4: "椭圆形"
}];
var answerIndex = 1;
var redTex = null;
cc.loader.loadRes("image/red", function (err, tex) {
  if (err == null) {
    redTex = tex;
  }
});
var greenTex = null;
cc.loader.loadRes("image/green", function (err, tex) {
  if (err == null) {
    greenTex = tex;
  }
});
var yellowTex = null;
cc.loader.loadRes("image/yellow", function (err, tex) {
  if (err == null) {
    yellowTex = tex;
  }
});
cc.Class({
  "extends": cc.Component,
  properties: {
    mask: {
      "default": null,
      type: cc.Mask,
      tooltip: "需要刮开的"
    },
    moneyLabel: {
      "default": null,
      type: cc.Label
    },
    progressBar1: {
      "default": null,
      type: cc.ProgressBar
    },
    hintSprite: {
      "default": null,
      type: cc.Sprite
    },
    passLabel: {
      "default": null,
      type: cc.Label
    },
    progressBar2: {
      "default": null,
      type: cc.ProgressBar
    },
    progressBar2Front: {
      "default": null,
      type: cc.Sprite
    },
    progressBar2After: {
      "default": null,
      type: cc.Sprite
    },
    nextBtn: {
      "default": null,
      type: cc.Button
    },
    titleSprite: {
      "default": null,
      type: cc.Sprite
    },
    titleLabel: {
      "default": null,
      type: cc.Label
    },
    answerBtn1: {
      "default": null,
      type: cc.Button
    },
    btnBackground1: {
      "default": null,
      type: cc.Sprite
    },
    btn1Label: {
      "default": null,
      type: cc.Label
    },
    answerBtn2: {
      "default": null,
      type: cc.Button
    },
    btnBackground2: {
      "default": null,
      type: cc.Sprite
    },
    btn2Label: {
      "default": null,
      type: cc.Label
    },
    answerBtn3: {
      "default": null,
      type: cc.Button
    },
    btnBackground3: {
      "default": null,
      type: cc.Sprite
    },
    btn3Label: {
      "default": null,
      type: cc.Label
    },
    answerBtn4: {
      "default": null,
      type: cc.Button
    },
    btnBackground4: {
      "default": null,
      type: cc.Sprite
    },
    btn4Label: {
      "default": null,
      type: cc.Label
    },
    scrapteRadiusX: {
      "default": 20.0,
      type: cc.Float,
      tooltip: "绘制点图形的x轴半径"
    },
    scrapteRadiusY: {
      "default": 22.0,
      type: cc.Float,
      tooltip: "绘制点图形的y轴半径"
    },
    scrapteArea: {
      "default": 0.5,
      type: cc.Float,
      tooltip: "需要刮开的图层面积的多少"
    },
    scrapeEvents: {
      "default": [],
      type: [cc.Component.EventHandler],
      tooltip: "擦除完成出发事件"
    }
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    var self = this;
    this.nextBtn.node.on("click", this.onNextBtn, this);
    this.answerBtn1.node.on("click", this.onAnswerBtn1, this);
    this.answerBtn2.node.on("click", this.onAnswerBtn2, this);
    this.answerBtn3.node.on("click", this.onAnswerBtn3, this);
    this.answerBtn4.node.on("click", this.onAnswerBtn4, this); //this.getInitNum();

    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegin, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
  },
  getInitNum: function getInitNum() {
    this.pixelNum = 0;
    this.achieveNum = this.scrapteArea * this.initPixel();
  },
  initPixel: function initPixel() {
    this.scrapeNode = this.mask.node.children[0];
    cc.log("this.scrapeNode ", this.mask.node.children.length);
    var x = this.scrapeNode.width,
        y = this.scrapeNode.height;
    console.log("x=", x, "y=", y);
    this.node.width = x;
    this.node.height = y;
    this.widthWide = x / 2 + 20;
    this.heightWide = x / 2 + 20;
    var zx = x / 2,
        zy = y / 2,
        dx = -zx,
        dy = -zy,
        dy1 = dy;
    var pixelPoint = [];
    var rx = this.scrapteRadiusX * 2;
    var ry = this.scrapteRadiusY * 2;

    for (; dx <= zx; dx += rx) {
      for (dy = dy1; dy <= zy; dy += ry) {
        var p = [dx, dy];
        p.isTouch = true;
        pixelPoint.push(p);
      }
    }

    this.pixelPoint = pixelPoint;
    return pixelPoint.length;
  },
  updateData: function updateData() {
    var levelData = LevelDataList[CurLevel - 1];
    this.btn1Label.string = levelData.a1;
    this.btn2Label.string = levelData.a2;
    this.btn3Label.string = levelData.a3;
    this.btn4Label.string = levelData.a4;
    this.titleLabel.string = levelData.title;
    this.titleSprite.node.active = true;
    this.nextBtn.node.active = false;
    this.btnBackground1.spriteFrame = new cc.SpriteFrame(yellowTex);
    this.btnBackground2.spriteFrame = new cc.SpriteFrame(yellowTex);
    this.btnBackground3.spriteFrame = new cc.SpriteFrame(yellowTex);
    this.btnBackground4.spriteFrame = new cc.SpriteFrame(yellowTex);
    this.getInitNum();
    var graphics = this.mask._graphics;
    graphics.clear();
  },
  start: function start() {
    this.moneyLabel.string = 0;
    this.passLabel.string = "第" + CurLevel + "关";
    this.btn1Label.string = "111111111";
    this.btn2Label.string = "222222222";
    this.btn3Label.string = "333333333";
    this.btn4Label.string = "444444444";
    this.progressBar1.progress = 0;
    this.progressBar2.progress = 1;
    this.nextBtn.node.active = false; // cc.loader.loadRes("config/level", function(err, data){
    //     console.log(err, data)
    //     if (err == null){
    //         levelData = data.json;
    //     }
    // });

    this.updateData();
  },
  endScape: function endScape() {
    this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchBegin, this);
    this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
  },
  // update (dt) {},
  onDestroy: function onDestroy() {
    this.endScape();
  },
  onNextBtn: function onNextBtn() {
    console.log("onNextBtn ", CurLevel, LevelDataList.length);
    CurLevel++;

    if (CurLevel > LevelDataList.length) {
      console.log("题目做完了");
      return;
    }

    this.updateData();
  },
  onAnswerBtn1: function onAnswerBtn1() {
    cc.log("onAnswerBtn1");

    if (answerIndex == 1) {
      this.handleRight(1);
    } else {
      this.handleError(1);
    }
  },
  onAnswerBtn2: function onAnswerBtn2() {
    cc.log("onAnswerBtn2");

    if (answerIndex == 2) {
      this.handleRight(2);
    } else {
      this.handleError(2);
    }
  },
  onAnswerBtn3: function onAnswerBtn3() {
    cc.log("onAnswerBtn3");

    if (answerIndex == 3) {
      this.handleRight(3);
    } else {
      this.handleError(3);
    }
  },
  onAnswerBtn4: function onAnswerBtn4() {
    cc.log("onAnswerBtn4");

    if (answerIndex == 4) {
      this.handleRight(4);
    } else {
      this.handleError(4);
    }
  },
  handleRight: function handleRight(index) {
    this.progressBar1.progress += 0.1;
    this.nextBtn.node.active = true;
    this.titleSprite.node.active = false;

    if (1 == index) {
      this.btnBackground1.spriteFrame = new cc.SpriteFrame(greenTex);
    } else if (2 == index) {
      this.btnBackground2.spriteFrame = new cc.SpriteFrame(greenTex);
    } else if (3 == index) {
      this.btnBackground3.spriteFrame = new cc.SpriteFrame(greenTex);
    } else if (4 == index) {
      this.btnBackground4.spriteFrame = new cc.SpriteFrame(greenTex);
    }
  },
  handleError: function handleError(index) {
    this.nextBtn.node.active = true;
    this.titleSprite.node.active = false;

    if (1 == index) {
      this.btnBackground1.spriteFrame = new cc.SpriteFrame(redTex);
    } else if (2 == index) {
      this.btnBackground2.spriteFrame = new cc.SpriteFrame(redTex);
    } else if (3 == index) {
      this.btnBackground3.spriteFrame = new cc.SpriteFrame(redTex);
    } else if (4 == index) {
      this.btnBackground4.spriteFrame = new cc.SpriteFrame(redTex);
    }
  },
  onTouchBegin: function onTouchBegin(event) {
    cc.log("touch begin"); //this.comFunc(event);
  },
  onTouchMove: function onTouchMove(event) {
    cc.log("touch move");
    this.comFunc(event);
  },
  onTouchEnd: function onTouchEnd(event) {
    cc.log("touch end");
    this.checkScrape();
    this.comFunc(event);
  },
  onTouchCancel: function onTouchCancel(event) {
    cc.log("touch cancel");
    this.checkScrape();
  },
  checkScrape: function checkScrape() {
    cc.log("目标数是：" + this.achieveNum);
    cc.log("现在已经刮开" + this.pixelNum);

    if (this.achieveNum <= this.pixelNum) {
      cc.log("已经刮完图层"); //this.achieveScrape();
    }

    console.log("使用的比例：", this.pixelNum / this.achieveNum);
    this.progressBar2.progress = this.progressBar2.progress - this.pixelNum / this.achieveNum;
    this.progressBar2After.node.active = false;
    cc.log("this.scrapteRadiusX = " + this.scrapteRadiusX);
    cc.log("this.scrapteRadiusY = " + this.scrapteRadiusY);
  },
  getPos: function getPos(e) {
    var point = e.touch.getLocation();
    point = this.node.convertToNodeSpaceAR(point);
    return point;
  },
  comFunc: function comFunc(event) {
    var point = this.getPos(event);
    this.checkPixelPoint(point);

    this._addCircle(point);
  },
  checkPixelPoint: function checkPixelPoint(point) {
    var pixelPoint = this.pixelPoint;
    var x, y;

    for (var i in pixelPoint) {
      x = Math.abs(point.x - pixelPoint[i][0]);
      y = Math.abs(point.y - pixelPoint[i][1]);

      if (x <= this.scrapteRadiusX && y <= this.scrapteRadiusY && pixelPoint[i].isTouch) {
        pixelPoint[i].isTouch = false;
        this.pixelNum++;
        return;
      }
    }
  },
  _addCircle: function _addCircle(point) {
    var graphics = this.mask._graphics;
    var color = cc.color(0, 0, 0, 255);
    graphics.lineWidth = 2;
    graphics.fillColor = color;
    graphics.ellipse(point.x, point.y, this.scrapteRadiusX, this.scrapteRadiusY);
    graphics.fill();
  },
  achieveScrape: function achieveScrape() {
    var _this = this;

    this.endScape();
    this.node.runAction(cc.fadeOut(0.5));
    this.scheduleOnce(function () {
      cc.Component.EventHandler.emitEvents(_this.scrapeEvents, new cc.Event.EventCustom("scrapeEvents"));
    }.bind(this), 0.6);
  }
});

cc._RF.pop();