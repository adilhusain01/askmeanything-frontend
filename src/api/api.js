import axios from 'axios'

export async function createChatSession(apiKey, externalUserId) {
  const url = 'https://api.on-demand.io/chat/v1/sessions'
  const headers = { apikey: apiKey }
  const body = { pluginIds: [], externalUserId: externalUserId }

  try {
    const response = await axios.post(url, body, { headers })
    return response.data.data.id
  } catch (error) {
    console.error('Error creating chat session:', error)
    throw error
  }
}

export async function submitQuery(apiKey, sessionId, query) {
  const url = `https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`
  const headers = { apikey: apiKey }
  const body = {
    endpointId: 'predefined-openai-gpt4o',
    query: query,
    pluginIds: [],
    responseMode: 'sync',
  }

  try {
    const response = await axios.post(url, body, { headers })
    return response.data
  } catch (error) {
    console.error('Error submitting query:', error)
    throw error
  }
}
