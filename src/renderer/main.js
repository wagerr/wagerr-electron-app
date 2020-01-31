// Vue Components and external libraries.
import Vue from 'vue';
import VueMoment from 'vue-moment';
import moment from 'moment-timezone';
import VeeValidate from 'vee-validate';
import VueClipboards from 'vue-clipboards';
import ElementUI from 'element-ui';
import router from './router';
import store from './store/index';
import App from './App';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en';
// Import frontend framework
import 'materialize-css/dist/css/materialize.css'
import 'materialize-css/dist/js/materialize.js'
import i18n from '../common/i18n/i18n';

// Import global styles
import './assets/scss/main.scss';

Vue.use(ElementUI, { locale });

// Config options.
Vue.config.productionTip = false;

// Inject the moment & moment timezone JS libs.
Vue.use(VueMoment, { moment });

// Inject the copy clipboard JS lib.
Vue.use(VueClipboards);

// Inject the vee form validation JS lib.
Vue.use(VeeValidate);

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
