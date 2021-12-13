import Vue from "vue";
import App from "./App.vue";
import "@/assets/css/tailwind.css";
import Chartick from "vue-chartkick";
import Chart from "chart.js";
import { VueSpinners } from "@saeris/vue-spinners";
import router from "@/router";
import { dollarFilter, percentFilter } from "@/filters";

Vue.use(VueSpinners); //npm i -S @saeris/vue-spinners
Vue.use(Chartick.use(Chart)); //Libreria para las graficas  npm i -S vue-chartkick@0.6.1 y npm i -S chart.js@2.8.0
Vue.filter("dollar", dollarFilter);
Vue.filter("percent", percentFilter);
Vue.config.productionTip = false;
//cuando el nombre de la propiedad es igual al de la varible se reduce una (var:var )
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
