
// 如果没有主动指定run_at为document_start（默认为document_idle），下面这种代码是不会生效的
document.addEventListener('DOMContentLoaded', function()
{
	// console.log('我被执行了！');
    // 注入自定义JS
	injectCustomJs();
    // var newBody = document.body.cloneNode(true)
    // var body = document.body.innerHTML;
    // var title = document.title;
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        // console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
        // console.log(request)
        if(request.cmd === 'gethtml') {
            // console.log(window.location)
            sendResponse({
                code: 0, 
                content:{
                    title: document.title,
                    body: document.body.innerHTML, 
                    aurl: window.location.href
                }
            })
        }
        else if(request.cmd === 'setpicture') {
            // 变更页面显示
            injectCustomJs('dist/script/modal.js')
            sendResponse({
                code: 0, 
                content: '注入成功'
            })
        } else if(request.cmd === 'setting') {
            let con = document.querySelector('.md-modal-wrap')
            if(con) {
                con.style.display = 'block'
            } else {
                injectCustomJs('dist/script/setting.js')
            }
            sendResponse({
                code: 0, 
                content: '注入成功'
            })
        } else sendResponse({code: 1, content: null})
    });
});

// 向页面注入JS
function injectCustomJs(jsPath)
{
	jsPath = jsPath || 'public/inject.js';
	var temp = document.createElement('script');
	temp.setAttribute('type', 'text/javascript');
	// 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
	temp.src = chrome.extension.getURL(jsPath);
	temp.onload = function()
	{
		// 放在页面不好看，执行完后移除掉
		this.parentNode.removeChild(this);
	};
	document.body.appendChild(temp);
}