import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Typography, Paper } from '@mui/material'
import axios from 'axios'
import { createChatSession, submitQuery } from '../api/api'
import Head from '../assets/head.jpg'

const TerminalInput = ({ onSubmit, placeholder }) => {
  const [input, setInput] = useState('')
  const [name, setName] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (!input.trim()) return
      onSubmit(input.trim())
      setInput('')
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Typography
        sx={{ color: '#00e676', marginRight: '8px', fontSize: '1.25rem' }}
      >
        {'>'}
      </Typography>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        style={{
          flex: 1,
          backgroundColor: '#13131a',
          color: '#fff',
          border: 'none',
          outline: 'none',
          fontSize: '1.25rem',
        }}
      />
    </div>
  )
}

const Connect = () => {
  const { id } = useParams()
  const [terminalOutput, setTerminalOutput] = useState([])
  const [sessionId, setSessionId] = useState(null)
  const [userName, setUserName] = useState('')
  const apiKey = '6yFYPvTI8vXITsmZxPgZMLGyBjmiqYpS'
  const [copied, setCopied] = useState(false)

  const fetchUserMetadata = async (userId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/usermeta/${userId}`
      )
      return response.data
    } catch (error) {
      console.error('Error fetching user metadata:', error)
      throw error
    }
  }

  const processUserMetadata = (metadata) => {
    const { user, questinoaire } = metadata

    const propmt = `Mimick a person who has these attributes and preferences as you can get what his taste is from the questions and the answers he gave. Now answer anything asked about you (you are this person now) and sound and reply like him with a ${user.vibe} vibe and a lot of a flirt.`

    const userInfo = `
      User Info:
      - Age: ${user.age}
      - Gender: ${user.gender}
      - Occupation: ${user.occupation}
      - City: ${user.city}, ${user.state}, ${user.country}
      - Hobbies: ${user.hobbies.join(', ')}
      - Smoking: ${user.smoking ? 'Yes' : 'No'}
      - Drinking: ${user.drinking ? 'Yes' : 'No'}
      - Body Type: ${user.body_type}
      - Height: ${user.height} ft
      - Weight: ${user.weight} kg
    `

    const questionnaireInfo = questinoaire.questions
      .map((q) => `${q.question} - ${q.answer}`)
      .join('\n')

    return `${propmt}\n\n${userInfo}\n\nQuestionnaire:\n${questionnaireInfo}`
  }

  useEffect(() => {
    const initializeChatSession = async () => {
      try {
        console.log('Fetching user metadata...')
        const userMetadata = await fetchUserMetadata(id)
        const processedMetadata = processUserMetadata(userMetadata)
        console.log('User metadata fetched and processed:', processedMetadata)

        console.log(userMetadata.user)

        setUserName(userMetadata.user.username) // Set the user's name

        console.log('Creating chat session...')
        const newSessionId = await createChatSession(apiKey, id)
        console.log('Chat session created with ID:', newSessionId)

        console.log('Submitting initial metadata...')
        await submitQuery(apiKey, newSessionId, processedMetadata)
        console.log('Initial metadata submitted')

        setSessionId(newSessionId)
      } catch (error) {
        console.error('Error initializing chat session:', error)
      }
    }

    initializeChatSession()
  }, [id])

  const handleSubmit = async (question) => {
    if (question.toLowerCase() === 'clear') {
      setTerminalOutput([])
      return
    }

    setTerminalOutput((prev) => [...prev, { type: 'question', text: question }])
    console.log('Question submitted:', question)

    try {
      if (!sessionId) {
        console.error('Session ID is not available')
        setTerminalOutput((prev) => [
          ...prev,
          { type: 'error', text: 'Session ID is not available' },
        ])
        return
      }

      console.log('Submitting query...')
      const response = await submitQuery(apiKey, sessionId, question)
      console.log('Query response received:', response)

      setTerminalOutput((prev) => [
        ...prev,
        { type: 'answer', text: response.data.answer },
      ])
    } catch (error) {
      console.error('Error fetching answer:', error)
      setTerminalOutput((prev) => [
        ...prev,
        { type: 'error', text: 'Error fetching answer' },
      ])
    }
  }

  const copyUrl = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <main className="grid grid-cols-12 h-screen w-full">
      <section className="col-span-3 p-[2rem]"></section>
      <Paper
        className="col-span-6"
        sx={{
          p: 4,
          backgroundColor: '#13131a',
          color: '#fff',
          height: '100vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          fontSize: '1.25rem',
        }}
      >
        {terminalOutput.map((entry, index) => (
          <Typography
            key={index}
            sx={{
              color:
                entry.type === 'question'
                  ? '#FEFAE0'
                  : entry.type === 'answer'
                  ? '#DDA15E'
                  : entry.type === 'response'
                  ? '#DDA15E'
                  : '#ff1744',
              fontSize: '1.25rem',
              lineHeight: '1.5',
              letterSpacing: '1.75px',
            }}
          >
            {entry.type === 'question' ? `> ${entry.text}` : `${entry.text}`}
          </Typography>
        ))}
        <TerminalInput
          onSubmit={handleSubmit}
          placeholder={`Ask ${userName} anything you want...`}
          sx={{ color: '#FEFAE0' }}
        />
      </Paper>
      <section className="col-span-3 p-[2rem] flex flex-col items-center justify-center gap-[1rem]">
        <div className="p-[1.5rem] flex flex-col bg-[white] gap-[1rem] rounded-xl">
          <h1 className="text-[1.5rem] font-bold text-black text-center">
            FaceHeads
          </h1>
          <img
            src={Head}
            alt=""
            className="h-20rem w-[25rem] object-cover rounded-xl"
          />
        </div>

        <div className="p-[1rem] flex flex-col bg-[white] gap-[1rem] rounded-xl">
          <h5 className="text-[1rem] text-black font-medium">
            Copy the Page Link and Attach it to Instagram Bio or any other
            Social App Bio
          </h5>

          <button
            onClick={copyUrl}
            className="px-[1.25rem] py-[0.5rem] bg-beige rounded-lg max-w-fit"
          >
            Copy
          </button>
          {copied && (
            <span className="text-[1rem] text-green-800">
              Link copied to clipboard!
            </span>
          )}
        </div>
      </section>
    </main>
  )
}

export default Connect
