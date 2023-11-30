import { createApp } from 'vue';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'animate.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Cookies from 'js-cookie'
import App from './app.vue';

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(ElementPlus)
app.config.globalProperties.$cookie = Cookies;
app.config.globalProperties.$app = {
    getName() {
        return GM_info['script']['name'];
    },
    getNameSpace() {
        return GM_info['script']['namespace'];
    },
    getVersion() {
        return GM_info['script']['version']
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
    }
}
app.mount(
  (() => {
    const $appRoot = document.createElement('div');
    $appRoot.id = 'qqGroupManagerApp';
    document.body.appendChild($appRoot);
    return $appRoot;
    })(),
);
