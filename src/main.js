// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import VueSession from 'vue-session'
import Vuetify from 'vuetify'
 
import 'iview/dist/styles/iview.css'
//import 'vuetify/dist/vuetify.min.css'

Vue.use(iView)
Vue.use(Vuetify)
Vue.use(VueSession)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})