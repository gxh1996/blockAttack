window.__require=function e(t,o,r){function n(s,a){if(!o[s]){if(!t[s]){var i=s.split("/");if(i=i[i.length-1],!t[i]){var l="function"==typeof __require&&__require;if(!a&&l)return l(i,!0);if(c)return c(i,!0);throw new Error("Cannot find module '"+s+"'")}}var u=o[s]={exports:{}};t[s][0].call(u.exports,function(e){return n(t[s][1][e]||e)},u,u.exports,e,t,o,r)}return o[s].exports}for(var c="function"==typeof __require&&__require,s=0;s<r.length;s++)n(r[s]);return n}({launch:[function(e,t,o){"use strict";cc._RF.push(t,"0cf12LQGqVCppMu+uU3y01c","launch"),Object.defineProperty(o,"__esModule",{value:!0});var r=cc._decorator,n=r.ccclass,c=r.property,s=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.userBlockPre=null,t.userBlockList=[],t}return __extends(t,e),t.prototype.start=function(){var e=this;wx.onMessage(function(t){switch(console.log("\u6536\u5230\u4e3b\u57df\u53d1\u6765\u7684\u6d88\u606f:",t),t.type){case"score":e.updateScore(t.value);break;case"friend":e.updateRankingList()}})},t.prototype.updateScore=function(e){var t=this;wx.getUserCloudStorage({keyList:["score"],success:function(o){var r;console.log("\u5f97\u5230\u7684\u7528\u6237\u4e91\u6570\u636e\uff1a",o),r=o.KVDataList.length>0?JSON.parse(o.KVDataList[0].value):0,e>r&&(t.setUserCloudStorage("score",JSON.stringify(e)),console.log("\u4fdd\u5b58\u6570\u636e\uff1a",e))},fail:function(){console.error("\u5bf9\u7528\u6237\u6258\u7ba1\u6570\u636e\u8fdb\u884c\u8bfb\u64cd\u4f5c\u5931\u8d25!")}})},t.prototype.updateRankingList=function(){var e=this,t=this;console.log("\u5f00\u59cb\u66f4\u65b0\u6392\u884c\u699c..."),wx.getFriendCloudStorage({keyList:["score"],success:function(o){console.log("\u597d\u53cb\u6258\u7ba1\u6570\u636e\uff1a",o);var r=t.getUGDOfTop(o.data,9);console.log("\u6392\u884c\u9760\u524d\u7684\u7528\u6237\uff1alist",r);var n=t.userBlockList.length-r.length;if(n<0){console.log("\u7528\u6237\u4fe1\u606f\u5757\u4e0d\u591f,n:",n),n=-n;for(var c=0;c<n;c++){var s=e.createUserBlock();t.userBlockList.push(s)}}else if(n>0)for(c=0;c<n;c++){(s=t.userBlockList.pop()).node.destroy()}if(r.length===t.userBlockList.length){for(c=0;c<r.length;c++){var a=e.getValueFromKVDataList(r[c].KVDataList,"score");t.userBlockList[c].init(c+1,a,r[c])}console.log("\u597d\u53cb\u6392\u884c\u699c\u66f4\u65b0\u5b8c\u6210!useerBlockList",t.userBlockList)}else console.error("\u7528\u6237\u4fe1\u606f\u5757\u6570\u91cf\u4e0d\u591f\uff0c\u8bf7\u5904\u7406\uff01")},fail:function(){console.error("wx.getFriendCloudStorage()\u5931\u8d25\uff01")}})},t.prototype.getUGDOfTop=function(e,t){var o=this;return 1===e.length?this.hasKeyInKVDataList(e[0].KVDataList,"score")?e:[]:(console.log("\u5f00\u59cb\u6392\u5e8f..."),e.sort(function(e,t){var r=Number(o.getValueFromKVDataList(e.KVDataList,"score")),n=Number(o.getValueFromKVDataList(t.KVDataList,"score"));return r===n?0:r<n?-1:1}),e.slice(0,t-1))},t.prototype.getValueFromKVDataList=function(e,t){for(var o,r=null,n=0,c=e;n<c.length;n++)if((o=c[n]).key===t){r=o.value;break}return null===r&&console.error("\u5728KVDataList\u4e2d\u6ca1\u6709\u627e\u5230\u60f3\u8981\u7684KVData\uff0c\u8bf7\u5904\u7406\uff01",o),r},t.prototype.hasKeyInKVDataList=function(e,t){var o=!1;if(e.length>0){for(var r=void 0,n=0,c=e;n<c.length;n++)if((r=c[n]).key===t){o=!0;break}null===r.value&&(o=!1)}return o},t.prototype.createUserBlock=function(){var e=cc.instantiate(this.userBlockPre);return this.node.addChild(e),e.getComponent("userBlock")},t.prototype.setUserCloudStorage=function(e,t){wx.setUserCloudStorage({KVDataList:[{key:e,value:t}],fail:function(){console.error("\u5bf9\u7528\u6237\u6258\u7ba1\u6570\u636e\u8fdb\u884c\u5199\u64cd\u4f5c\u5931\u8d25\uff01")}})},__decorate([c({type:cc.Prefab})],t.prototype,"userBlockPre",void 0),t=__decorate([n],t)}(cc.Component);o.default=s,cc._RF.pop()},{}],userBlock:[function(e,t,o){"use strict";cc._RF.push(t,"5290ecID6pGnoqTDJgtiaCu","userBlock"),Object.defineProperty(o,"__esModule",{value:!0});var r=cc._decorator,n=r.ccclass,c=r.property,s=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.no=null,t.image=null,t.username=null,t.score=null,t}return __extends(t,e),t.prototype.init=function(e,t,o){var r=this;this.no.string=e.toString(),this.username.string=o.nickname,this.score.string=t,cc.loader.load({url:o.avatarUrl,type:"png"},function(e,t){e?console.error(e):r.image.spriteFrame=new cc.SpriteFrame(t)})},__decorate([c({type:cc.Label})],t.prototype,"no",void 0),__decorate([c({type:cc.Sprite})],t.prototype,"image",void 0),__decorate([c({type:cc.Label})],t.prototype,"username",void 0),__decorate([c({type:cc.Label})],t.prototype,"score",void 0),t=__decorate([n],t)}(cc.Component);o.default=s,cc._RF.pop()},{}]},{},["userBlock","launch"]);