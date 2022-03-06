
import TurndownService from 'turndown'
import { gfm, tables, strikethrough } from 'turndown-plugin-gfm'
import http from './http'
import { accesscof } from './config'

class HtmlTCode {
  constructor(props){
    const {aUrl, author} = props
    this.aUrl = aUrl
    this.author = author
    this.init()
  }

  init() {
    Object.keys(accesscof).forEach((key) => {
      if(this.aUrl.indexOf(key) !== -1) {
        this.formInfo = accesscof[key]
        return
      }
    })
    this.imgAttrs = ['data-src', 'data-original-src', 'data-original', 'src']
  }

  setBody = async (body) => {
    if(!this.formInfo) return ''
    let template = document.createElement('div');
    template.innerHTML = body;
    this.dom = template
    this.contentDom = this.getDom(this.formInfo.contentType)
    // 处理图片
    await this.changeRelativeUrl()
    // 增加底部
    // this.addBottom()
  }

  // 获取DOM
  getDom = (selector) => { 
    // 获取准确的文章内容
    const htmlContent = this.dom.querySelector(selector)
    if(this.formInfo.type === 'imooc') {
      return htmlContent.firstElementChild
    }
    return htmlContent
  }

  // 处理文章标题文章标题
  dealTitle = (title) => {
    // 获取准确的文章内容
    return title.slice(0, -18)
  }

  // 获取文章内容
  getContent = () => {
    const turndownService = new TurndownService({ codeBlockStyle: 'fenced' })
    turndownService.use(gfm)
    turndownService.use([tables, strikethrough])
    turndownService.addRule('pre2Code', {
      filter: ['pre'],
      replacement(content) {
        return '\n```js\n' + content + '\n```\n'
      }
    })
    turndownService.addRule('delNode', {
      filter: ['style', 'noscript'],
      replacement: function () {
        return ''
      }
    })
    const markdown = turndownService.turndown(this.contentDom)
    return markdown 
  }

  // 获取图片路径
  dealImgUrl = (img) => {
    /**
     * 处理懒加载路径
     * 简书：data-original-src
     * 掘金：data-src
     * segmentfault：data-src
     * 知乎专栏：data-original
     **/
    for (let i = 0, len = this.imgAttrs.length; i < len; i++) {
      const src = img.getAttribute(this.imgAttrs[i])
      // 图片转存
      if (src) { return src }
    }
    return ''
  }

  // 获取绝对地址
  getAbsoluteUrl (src) {
    // 获取图片、链接的绝对路径
    const aOrigin = new URL(this.aUrl).origin || ''
    return new URL(src, aOrigin).href
  }

  // 处理图片、链接
  changeRelativeUrl = async () => {
    let tempDom = this.contentDom
    // 处理dom中的img、a
    const imgs = tempDom.querySelectorAll('img')
    console.log('imgs: ', imgs)

    if(!this.formInfo.convert) {  
      imgs.length > 0 && imgs.forEach((v) => {
        const src = this.dealImgUrl(v)
        v.src = this.getAbsoluteUrl(src)
      })
      return
    }
    // 处理图片转存
    let imgUrls = []
    // 更新html中的相对图片地址（segment）
    imgs.length > 0 && imgs.forEach((v) => {
      const src = this.dealImgUrl(v)
      imgUrls.push(this.getAbsoluteUrl(src))
    })
    // 图片私有域转化
    let values = await http.post('https://api.muyiy.cn/mdcode/uploadQiniu', {files: imgUrls})
    console.log('values: ', values)
    for(let i = 0; i < values.length; i++) {
      if(values[i].status === 'fulfilled') {
        // 上传成功
        imgs[i].src = values[i].value
      } else {
        // 上传失败
        imgs[i].src = imgUrls[i]
      }
    }
    // 更新dom
    this.contentDom = tempDom
  }

  // 底部加入文章来源
  addBottom = () =>{
    // 底部加入文章来源
    const bottomDom = window.document.createElement('div')
    bottomDom.innerHTML = `<br/><blockquote>本文授权转自：${this.author}<br/> <a href="${this.aUrl}" target="_blank">${this.aUrl}</a></blockquote>`
    this.contentDom.appendChild(bottomDom)
  }
}

export default HtmlTCode

