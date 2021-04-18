import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './app.vue';
import $ from 'jquery';
const Cookies = require('js-cookie');

import animate from 'animate.css';
Vue.use(animate);

const appRoot = document.createElement('div');
appRoot.id = 'app';
document.body.appendChild(appRoot);

Vue.prototype.$cookie = Cookies;
Vue.prototype.$app = {
  getName() {
    try{
      return GM_info['script']['name'];
    } catch(e){      
      return chrome.runtime.getManifest().name;
    }
  },
  getNameSpace() {
    return GM_info['script']['namespace'];
  },
  getVersion() {
    try{
      return GM_info['script']['version'];
    } catch(e){      
      return chrome.runtime.getManifest().version;
    }
  },  
  delay(){
    let ms = Math.floor(Math.random()*3+1) * 1000;
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  },  
  htmlDecode(html){
    if (html.length == 0) return "";
    html = html.replace(/&amp;/g, "&");
    html = html.replace(/&lt;/g, "<");
    html = html.replace(/&gt;/g, ">");
    html = html.replace(/&nbsp;/g, " ");
    html = html.replace(/&quot/g, "'");
    return html;
  },
  formatDateTime(timestamp, format){
    let dt = new Date(timestamp*1000);
    let ret;
    const opt = {
        "Y+": dt.getFullYear().toString(),        // 年
        "m+": (dt.getMonth() + 1).toString(),     // 月
        "d+": dt.getDate().toString(),            // 日
        "H+": dt.getHours().toString(),           // 时
        "M+": dt.getMinutes().toString(),         // 分
        "S+": dt.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(format);
        if (ret) {
            format = format.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return format;
  },
}

Vue.use(ElementUI);

new Vue({
  el: '#app',
  render: h => h(App)
});