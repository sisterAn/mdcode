//使用插件child_process
const child_process = require('child_process');

//清空指定文件夹下文件
child_process.exec('rm -fr mdcode-chrome/*',function(err){
    console.log(err)      //当成功是error是null 
})

//复制指定文件夹下文件到另一个文件下
child_process.exec(`cp -rvf imgs mdcode-chrome`,function(err){
    console.log(err)      //当成功是error是null
})

child_process.exec('cp -rvf public mdcode-chrome',function(err){
    console.log(err)      //当成功是error是null
})

child_process.exec('cp -rvf dist mdcode-chrome',function(err){
    console.log(err)      //当成功是error是null
})

//清空指定文件夹下文件
child_process.exec('rm -fr mdcode-chrome/dist/imgs',function(err){
    console.log(err)      //当成功是error是null 
})

child_process.exec('cp -rvf manifest.json mdcode-chrome',function(err){
    console.log(err)      //当成功是error是null
})