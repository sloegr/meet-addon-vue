<template>
  <div class="side-panel">
    <!-- Development mode indicator -->
    <div v-if="!isInMeet" class="dev-warning">⚠️ Development Mode (not in Google Meet)</div>

    <h1>Side Panel</h1>
    <p>This is the add-on Side Panel. Only you can see this.</p>

    <button @click="launchMainStage" :disabled="!isInMeet" class="launch-button">
      Launch Activity in Main Stage
    </button>

    <div v-if="!isInMeet" class="dev-info">
      <p>To test in Google Meet:</p>
      <ol>
        <li>Deploy this add-on to a public URL</li>
        <li>Configure it in Google Cloud Console</li>
        <li>Install and open in a Meet call</li>
      </ol>
    </div>

    <div v-else class="status">✓ Connected to Google Meet</div>
  </div>
</template>

<script>
export default {
  name: 'SidePanelApp',
  data() {
    return {
      sidePanelClient: null,
      isInMeet: false,
    }
  },
  async mounted() {
    await this.initializeMeetSDK()
  },
  methods: {
    async initializeMeetSDK() {
      try {
        // Check if we're in a Meet context by looking for URL parameters
        const urlParams = new URLSearchParams(window.location.search)
        const hasMeetParams = urlParams.has('meet_sdk')

        if (!hasMeetParams) {
          console.log('Not running in Google Meet - SDK initialization skipped')
          this.isInMeet = false
          return
        }

        // Only import and initialize SDK if we're in Meet
        const { meet } = await import('@googleworkspace/meet-addons/meet.addons')

        const session = await meet.addon.createAddonSession({
          cloudProjectNumber: '893187114358',
        })

        this.sidePanelClient = await session.createSidePanelClient()
        this.isInMeet = true
        console.log('Meet SDK initialized successfully')
      } catch (error) {
        console.error('Failed to initialize Meet SDK:', error)
        this.isInMeet = false
      }
    },

    async launchMainStage() {
      if (!this.sidePanelClient) {
        alert('Not connected to Google Meet')
        return
      }

      try {
        await this.sidePanelClient.startActivity({
          mainStageUrl: 'YOUR_MAIN_STAGE_URL',
        })
      } catch (error) {
        console.error('Failed to launch main stage:', error)
      }
    },
  },
}
</script>

<style scoped>
.side-panel {
  padding: 20px;
  font-family: Arial, sans-serif;
  max-width: 400px;
}

.dev-warning {
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  color: #856404;
}

.dev-info {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-size: 14px;
}

.dev-info ol {
  margin: 10px 0 0 0;
  padding-left: 20px;
}

.status {
  margin-top: 15px;
  padding: 10px;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  color: #155724;
}

.launch-button {
  padding: 10px 20px;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 15px;
}

.launch-button:hover:not(:disabled) {
  background-color: #1557b0;
}

.launch-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

h1 {
  margin-top: 0;
}
</style>
