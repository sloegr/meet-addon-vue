<template>
  <div class="main-stage">
    <div v-if="!isInitialized" class="loading">Initializing Main Stage...</div>

    <div v-else class="content-wrapper">
      <h1>Main Stage Activity</h1>
      <p>This content is visible to all meeting participants.</p>

      <div class="content">
        <h2>Welcome to the Activity!</h2>
        <p>All participants can see and interact with this content.</p>

        <div class="interactive-section">
          <p>Counter: {{ counter }}</p>
          <button @click="counter++" class="action-button">Click Me! ({{ counter }})</button>
        </div>

        <div class="info">
          <p>✓ Main Stage is active</p>
          <p>Started at: {{ startTime }}</p>
        </div>
      </div>
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const mainStageClient = ref(null)
const isInitialized = ref(false)
const error = ref(null)
const counter = ref(0)
const startTime = ref('')

const initializeMainStage = async () => {
  try {
    const { meet } = await import('@googleworkspace/meet-addons/meet.addons')

    // Create addon session in main stage
    const session = await meet.addon.createAddonSession({
      cloudProjectNumber: '893187114358', // Same as SidePanel
    })

    // Create main stage client - this signals loading is complete
    mainStageClient.value = await session.createMainStageClient()

    isInitialized.value = true
    startTime.value = new Date().toLocaleTimeString()
    console.log('✓ Main stage initialized successfully')
  } catch (err) {
    console.error('Failed to initialize main stage:', err)
    error.value = 'Failed to initialize: ' + err.message
    isInitialized.value = false
  }
}

onMounted(() => {
  initializeMainStage()
})
</script>

<style scoped></style>
