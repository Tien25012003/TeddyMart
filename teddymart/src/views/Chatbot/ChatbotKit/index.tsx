import React from 'react'
import Chatbot from 'react-chatbot-kit'
import config from './components/config'
import MessageParser from './components/MessageParser'
import ActionProvider from './components/ActionProvider'

export default function ChatbotKit() {
  return (
    <div className=''>
        <Chatbot
        
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
        headerText='Chào mừng bạn đến với Khang Chatbot'
        placeholderText='Hãy nhập điều bạn muốn hỏi nà'
      />
    </div>
    
  )
}