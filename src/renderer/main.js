// Vue Components and external libraries.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import store from './store/index'
import axios from 'axios'
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
import VeeValidate from 'vee-validate'
import VueClipboards from 'vue-clipboards'

// Import some inherited css styles and icons.
import './assets/css/fonts.css'
import './assets/css/icons.css'

// Import some global scss styles
import './assets/scss/main.scss'

// Config options.
Vue.config.productionTip = false

// Inject the moment & moment timezone JS libs.
Vue.use(VueMoment, { moment })

// Inject the copy clipboard JS lib.
Vue.use(VueClipboards)

// Inject the vee form validation JS lib.
Vue.use(VeeValidate)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    components: {App},
    router,
    store,
    template: '<App/>'
}).$mount('#app')