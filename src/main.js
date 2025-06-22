import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { Toast } from 'vant';
import 'vant/lib/index.css';

const app = createApp(App)

app.use(Toast).mount('#app')
