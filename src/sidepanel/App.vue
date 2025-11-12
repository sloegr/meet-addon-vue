<template>
  <div class="side-panel">
    <h1>Side Panel</h1>
    <p>This is the add-on Side Panel. Only you can see this.</p>

    <button @click="launchMainStage" class="launch-button">Launch Activity in Main Stage</button>

    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const sidePanelClient = ref(null)
const isInMeet = ref(false)
const error = ref(null)

const initializeMeetSDK = async () => {
  try {
    const { meet } = await import('@googleworkspace/meet-addons/meet.addons')

    const session = await meet.addon.createAddonSession({
      cloudProjectNumber: '893187114358',
    })

    sidePanelClient.value = await session.createSidePanelClient()
    isInMeet.value = true
    console.log('✓ Side panel initialized successfully')
  } catch (err) {
    console.log('Not running in Google Meet:', err.message)
    isInMeet.value = false
  }
}

const launchMainStage = async () => {
  if (!sidePanelClient.value) {
    error.value = 'Not connected to Google Meet'
    return
  }

  try {
    await sidePanelClient.value.startActivity({
      mainStageUrl: 'https://sloegr.github.io/meet-addon-vue/MainStage.html',
    })
    console.log('✓ Main stage launched successfully')
    error.value = null
  } catch (err) {
    console.error('Failed to launch main stage:', err)
    error.value = 'Failed to launch: ' + err.message
  }
}

onMounted(() => {
  initializeMeetSDK()
})
</script>

<style scoped>
/* Same styles as before */
</style>
