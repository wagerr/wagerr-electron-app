// Vue Components and external libraries.
import Vue from 'vue';
import VueMoment from 'vue-moment';
import moment from 'moment-timezone';
import VeeValidate from 'vee-validate';
import VueClipboards from 'vue-clipboards';
import PerfectScrollbar from 'vue2-perfect-scrollbar';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';

import router from './router';
import store from './store';
import App from './App.vue';

// Import frontend framework
import 'element-ui/lib/theme-chalk/index.css';
import 'materialize-css/dist/css/materialize.css';
import 'materialize-css/dist/js/materialize';
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css';

// Import global styles
import './assets/scss/main.scss';

Vue.use(PerfectScrollbar);

Vue.use(ElementUI, { locale });

// Config options.
Vue.config.productionTip = false;

// Inject the moment & moment timezone JS libs.
Vue.use(VueMoment, { moment });

// Inject the copy clipboard JS lib.
Vue.use(VueClipboards);

// Inject the vee form validation JS lib.
Vue.use(VeeValidate);

// Initializes the materializecss components of a Vue component
Vue.prototype.$initMaterialize = function () {
  const modals = this.$el.querySelectorAll('.modal:not(.no-auto-init)');
  M.Tabs.init(this.$el.querySelector('.tabs'));
  M.Dropdown.init(this.$el.querySelectorAll('.dropdown-trigger'));
  M.Tooltip.init(this.$el.querySelectorAll('.tooltipped'));
  M.Modal.init(modals);
};

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
