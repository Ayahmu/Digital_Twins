import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import dataV from "@jiaminghi/data-view"; //全局组件导入
import "./assets/css/index.css"; //全局导入CSS
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import TableBlock from "./components/TableBlock.vue";
import PageGather from "./components/PageGather.vue";
import moment from 'moment';


Vue.use(ElementUI);
Vue.use(dataV);

Vue.config.productionTip = false;
Vue.prototype.$bus = new Vue();

Vue.component("TableBlock", TableBlock);
Vue.component("PageGather", PageGather);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
