import { createApp } from 'vue'
import App from './App.vue'
import { meet } from '@googleworkspace/meet-addons/meet.addons'

const CLOUD_PROJECT_NUMBER = '893187114358'

async function initializeMainStage() {
  const session = await meet.addon.createAddonSession({
    cloudProjectNumber: CLOUD_PROJECT_NUMBER,
  })

  await session.createMainStageClient()

  // Mount Vue app
  createApp(App).mount('#app')
}

initializeMainStage()
