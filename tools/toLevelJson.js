const xlsx = require("node-xlsx");
const fs = require("fs");
var level = [];
var list = xlsx.parse("level.xlsx")[0].data;
console.log(list.length)
var temp = {};
var keyArr = list[0];
for (var i = 1; i < list.length; ++i){
    var itemArr = list[i];
    temp = {};
    if (itemArr.length > 0)
    {
        for(var j = 0; j < itemArr.length; ++j){
            temp[keyArr[j]] = itemArr[j];
        }
        level.push(temp);
    }
}

console.log(level.length);

fs.writeFileSync("../assets/resources/config/level.json", JSON.stringify(level));