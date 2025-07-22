'use client';
import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';


export default function Home() {
  const [username, setUsername] = useState('')
  const [isJoined, setIsJoined] = useState(false)

  const handleJointChat = () => {
    if(username.trim()){
      setIsJoined(true)
    }
  }

  if(!isJoined) {
    return(
      <div className='flex items-center justify-center h-screen bg-gray-100'>
        <div className='bg-white p-8 rounded shadow-md'>
          <h2 className='text-2xl font-bold mb-4 text-black'>Enter Your Name</h2>
          <input
            type='text'
            className='border rounded px-4 py-2 w-full mb-4 text-black'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => {
              if(e.key === 'Enter'){
                handleJointChat()
              }
            }}
          />
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white rounded px-4 py-2 cursor-pointer'
            onClick={handleJointChat}
          >
            Join Chat
          </button>
        </div>
      </div>
    )
  }

  return(
    <main className='flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100'>
      <ChatInterface username= {username} />
    </main>
  )
}