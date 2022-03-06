import * as React from "react";
import HtmlTCode from '../public/html2code'
import mdPng from '../imgs/markdown-fill-square.png'
import picPng from '../imgs/picture-setting.png'
import settingPng from '../imgs/setting.png'
import './index.less'

// import Setting from './setting'

export default function App() {

  const sendMessageToContentScript = (message, callback) => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
    {
      chrome.tabs.sendMessage(tabs[0].id, message, function(response)
      {
        if(callback) callback(response);
      });
    });
  }

  const getArticle = () => {
    sendMessageToContentScript({cmd:'gethtml', value:'你好，我是popup！'}, async function(res) {
      // console.log('来自content的回复：'+JSON.stringify(res));
      if(res.code === 0) {
        const { 
          title = '',
          body = '',
          aurl = ''
        } = res.content
        const html2code = new HtmlTCode({
          aUrl: aurl,
          author: ''
        })
        await html2code.setBody(body)
        const newTitle = html2code.dealTitle(title)
        const newContent = html2code.getContent()
        // console.log('-----------title')
        // console.log(newTitle)
        // console.log('-----------content')
        // console.log(newContent)
        copyToClip(newContent)
        winClose()
      }
    })
  }

  /**
   * 复制内容到粘贴板
   * content : 需要复制的内容
   * message : 复制完后的提示，不传则默认提示"复制成功"
   */
  const copyToClip = (content, message='采集成功') => {
    // 动态创建 textarea 标签
    const textarea = document.createElement('textarea')
    // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
    textarea.readOnly = 'readonly'
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    // 将要 copy 的值赋给 textarea 标签的 value 属性
    textarea.value = content
    // 将 textarea 插入到 body 中
    document.body.appendChild(textarea)
    // 选中值并复制
    textarea.select()
    textarea.setSelectionRange(0, textarea.value.length)
    document.execCommand('Copy')
    document.body.removeChild(textarea)
    alert(message);
  }

  /**
   * 设置图床
   */
  const settingPic = () => {
    sendMessageToContentScript({cmd:'setpicture', value:'设置图床'}, async function(res) {
      // console.log('来自content的回复：'+JSON.stringify(res));
      if(res.code === 0) {
        winClose()
      }
    })
  }

  /**
   * 输出支持平台
   */
  const onSetting = () => {
    sendMessageToContentScript({cmd:'setting', value:'设置图床'}, async function(res) {
      // console.log('来自content的回复：'+JSON.stringify(res));
      if(res.code === 0) {
        winClose()
      }
    })
  }

  const winClose = () => {
    // let pageWin = chrome.extension.getBackgroundPage()
    // console.log('----chrome.extension.getBackgroundPage()----', pageWin)
    // pageWin.close()
  }

  return (
    <div className="mdcode">
      <div className="mdcode-title">mdcode <span className="gray-color-1">竭诚为您服务</span>🎉🎉🎉</div>
      {/* <div className="mdcode-sub-title">常用功能</div> */}
      <div className="mdcon">
        <div className="mdcon-li" onClick={getArticle}>
          <img src={mdPng} />
          <div>采集文章</div>
        </div>
        <div className="mdcon-li" onClick={onSetting}>
          <img src={settingPng} />
          <div>支持平台</div>
        </div>
      </div>
      {/* <Setting /> */}
    </div>
  );
}
