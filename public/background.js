

chrome.runtime.onInstalled.addListener(function(){
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
		chrome.declarativeContent.onPageChanged.addRules([
			{
				conditions: [
					// 只有打开百度才显示pageAction
					new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlMatches: '(segmentfault|juejin｜weixin\.qq|zhihu|jianshu|csdn|oschina|imooc|cnblogs|toutiao)\.(com|cn|net)'}})
				],
				actions: [new chrome.declarativeContent.ShowPageAction()]
			}
		]);
	});
});

chrome.contextMenus.create({
	title: "点击采集文章",
	onclick: function(){
        // TODO: 文章采集功能
        // chrome.tabs.getSelected(null, function (tab) {　　// 先获取当前页面的tabID
        //     chrome.tabs.sendMessage(tab.id, {greeting: "gethtml"}, function(response) {
        //       console.log(response);　　// 向content-script.js发送请求信息
        //     });
        // })
        function sendMessageToContentScript(message, callback)
        {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
            {
                chrome.tabs.sendMessage(tabs[0].id, message, function(response)
                {
                    if(callback) callback(response);
                });
            });
        }
        sendMessageToContentScript({cmd:'gethtml', value:'你好，我是background！'}, function(res) {
            console.log('来自content的回复：'+JSON.stringify(res));
            // if(res.code === 0) {

            // }
        })
    },
});
