import { createApp } from 'vue'
import App from './App.vue'

console.log('Main Stage loading...')

const app = createApp(App)
app.mount('#app-mainstage')

console.log('Main Stage mounted successfully')
