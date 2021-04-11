import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './app.vue';
const Cookies = require('js-cookie');

import animate from 'animate.css';
Vue.use(animate);

const appRoot = document.createElement('div');
appRoot.id = 'app';
document.body.appendChild(appRoot);

Vue.prototype.$cookie = Cookies;
Vue.prototype.$app = {
  getName: function() {
    return GM_info['script']['name'];
  },
  getNameSpace: function() {
    return GM_info['script']['namespace'];
  },
  getVersion: function() {
    return GM_info['script']['version'];
  },
}

Vue.use(ElementUI);

new Vue({
  el: '#app',
  render: h => h(App)
});