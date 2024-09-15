import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SwipeableViews from 'react-swipeable-views'
import { Button, Typography, Box } from '@mui/material'
import axios from 'axios'
import { regularQuestions as questions } from '../data/questionary'
import { useAuth } from '../context/authContext' // Adjust the import path as necessary

const Info = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const navigate = useNavigate()
  const { user } = useAuth()

  const questionnaireData = {
    user: user?.id,
    questions: answers.map(({ question, answer }) => ({
      question,
      answer,
    })),
  }

  const handleAnswerSelection = (answer) => {
    setAnswers((prevAnswers) => [
      ...prevAnswers,
      {
        question: questions[currentQuestionIndex].question,
        answer,
      },
    ])
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      submitAnswers()
    }
  }

  // Submit answers to the backend
  const submitAnswers = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/questionnaires`,
        questionnaireData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      const response2 = await axios.put(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/users/${user?.id}`,
        {
          doneQuestinoaire: true,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      console.log('Questionnaire submitted successfully', response.data)
      navigate('/profile')
    } catch (error) {
      console.error('Error submitting questionnaire', error.response?.data)
    }
  }

  return (
    <main className="flex items-center justify-center w-full h-screen">
      <div className="px-[2.5rem] py-[2.5rem] bg-white max-w-[30rem] rounded-xl">
        <SwipeableViews index={currentQuestionIndex} disabled>
          {questions.map((q, index) => (
            <Box
              key={index}
              className="flex flex-col items-center justify-center gap-[1rem] w-full h-full"
            >
              <Typography
                variant="h5"
                className="text-[1.25rem] text-black text-center"
                sx={{
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                }}
              >
                {q.question}
              </Typography>
              {q.options.map((option, idx) => (
                <Button
                  fullWidth
                  key={idx}
                  variant="contained"
                  onClick={() => handleAnswerSelection(option)}
                  sx={{
                    backgroundColor: 'black',
                    fontSize: '1rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  {option}
                </Button>
              ))}
            </Box>
          ))}
        </SwipeableViews>
      </div>
    </main>
  )
}

export default Info
