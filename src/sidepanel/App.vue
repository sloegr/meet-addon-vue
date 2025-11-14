<template>
  <div class="side-panel">
    <h1>Side Panel</h1>
    <p>This is the add-on Side Panel. Only you can see this.</p>

    <label for="clientCode">Client Code: </label>
    <input type="text" id="clientCode" name="clientCode" v-model="clientCode" /><br /><br />
    <button @click="login">Login</button><br /><br />
    <label for="meetingCode">Meeting Code: </label>
    <input type="text" id="meetingCode" name="meetingCode" v-model="meetingCode" /><br /><br />
    <button @click="joinMeeting">Join Meeting</button><br /><br />

    <button @click="launchMainStage" class="launch-button">Launch Activity in Main Stage</button>

    <div v-if="error" class="error">
      {{ error }}
    </div>
    <div v-if="apiResponse" class="success">
      {{ apiResponse }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const clientCode = ref('')
const meetingCode = ref('')
const apiResponse = ref(null)
const tokenResponse = ref(null)

const sidePanelClient = ref(null)
const isInMeet = ref(false)
const error = ref(null)

const login = () => {
  error.value = null
  apiResponse.value = null

  if (!clientCode.value) {
    error.value = 'Please input a Google Cloud Client ID before logging in'
    return
  }

  if (typeof google === 'undefined' || !google.accounts?.oauth2) {
    error.value = 'Google Identity Services library is not loaded.'
    console.error(error.value)
    return
  }

  const client = google.accounts.oauth2.initTokenClient({
    client_id: clientCode.value,
    scope:
      'https://www.googleapis.com/auth/meetings.space.created https://www.googleapis.com/auth/meetings.conference.media.readonly https://www.googleapis.com/auth/meetings.space.readonly',
    callback: (response) => {
      console.log('Token response:', response)
      tokenResponse.value = response
      apiResponse.value = 'Login successful!'
    },
    error_callback: (errorResponse) => {
      console.error('Login error:', errorResponse)
      error.value = `Login failed. Error: ${errorResponse.type || 'Unknown error'}`
    },
  })

  client.requestAccessToken()
}

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

const joinMeeting = async () => {
  error.value = null
  apiResponse.value = null
  if (!meetingCode.value) {
    error.value = 'Please enter a meeting code.'
    return
  }

  try {
    // Point to your local server endpoint
    const response = await fetch('http://localhost:3000/api/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientCode: clientCode.value,
        meetingCode: meetingCode.value,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`API request failed: ${response.status} ${errorData}`)
    }

    const data = await response.json()
    apiResponse.value = data.message // Display message from the server
    console.log('Success:', data)
  } catch (err) {
    console.error('API call failed:', err)
    error.value = err.message
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
.error {
  color: red;
  margin-top: 10px;
}
.success {
  color: green;
  margin-top: 10px;
}
</style>
