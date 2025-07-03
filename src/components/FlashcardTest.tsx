import React, { useState, FormEvent } from 'react'
import { saveSelectedSubject } from '@/lib/saveSelectedSubject'
import { createFlashcard } from '@/lib/createFlashcard'
import { useRealtimeFlashcards } from '@/hooks/useRealtimeFlashcards'

// Hardcoded subjects for the dropdown
const subjects = ['Math', 'Science', 'History', 'Programming']

export function FlashcardTest() {
  const { flashcards, loading, error } = useRealtimeFlashcards()

  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0])
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  const handleSaveSubject = async () => {
    setStatusMessage('Saving subject...')
    const result = await saveSelectedSubject(selectedSubject)
    console.log('Result from saveSelectedSubject:', result)

    if (result.success && result.data) {
      setStatusMessage(`Subject '${selectedSubject}' saved! Response: ${JSON.stringify(result.data)}`)
    } else {
      setStatusMessage(`Error saving subject: ${result.error?.message}`)
    }
  }

  const handleCreateFlashcard = async (e: FormEvent) => {
    e.preventDefault()
    if (!question || !answer) {
      setStatusMessage('Please fill out all fields.')
      return
    }
    setStatusMessage('Creating flashcard...')
    const result = await createFlashcard({
      question,
      answer,
      subject: selectedSubject,
    })
    console.log('Result from createFlashcard:', result)

    if (result.success && result.data) {
      setStatusMessage(`Flashcard created! Response: ${JSON.stringify(result.data)}`)
      setQuestion('')
      setAnswer('')
    } else {
      setStatusMessage(`Error creating flashcard: ${result.error?.message}`)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Flashcard Integration Test</h1>
      
      {statusMessage && <p className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-md">{statusMessage}</p>}

      {/* Section 1: Subject Selection */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">1. Select and Save a Subject</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="p-2 border rounded-md w-full max-w-xs focus:ring-2 focus:ring-blue-500"
          >
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            onClick={handleSaveSubject}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Subject
          </button>
        </div>
      </div>

      {/* Section 2: Flashcard Creation */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">2. Create a Flashcard</h2>
        <form onSubmit={handleCreateFlashcard} className="space-y-4">
          <div>
            <label htmlFor="subject-display" className="block text-sm font-medium text-gray-600">Subject</label>
            <input
              id="subject-display"
              type="text"
              value={selectedSubject}
              readOnly
              className="mt-1 block w-full p-2 border border-gray-300 bg-gray-100 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-600">Question</label>
            <input
              id="question"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., What is the capital of France?"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="answer" className="block text-sm font-medium text-gray-600">Answer</label>
            <textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="e.g., Paris"
              rows={3}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Create Flashcard
          </button>
        </form>
      </div>

      {/* Section 3: Flashcard List */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">3. Your Real-Time Flashcards</h2>
        {loading && <p>Loading flashcards...</p>}
        {error && <p className="text-red-500">Error: {error.message}</p>}
        {!loading && !error && (
          <ul className="space-y-4">
            {flashcards.length > 0 ? (
              flashcards.map((fc) => (
                <li key={fc.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                  <p className="font-bold text-lg text-gray-800">{fc.question}</p>
                  <p className="text-gray-600 mt-1">{fc.answer}</p>
                  <span className="mt-2 inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{fc.subject}</span>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No flashcards found. Create one above to get started!</p>
            )}
          </ul>
        )}
      </div>
    </div>
  )
} 