import { createApp } from 'vue'
import './style.css'
import router from '@/router'
import App from './App.vue'
import { Lazyload } from 'vant'
// import 'vant/lib/index.css';


const app =  createApp(App)
app.use(router)
app.use(Lazyload)


app.mount('#app')
