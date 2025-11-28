import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { createSocketConnection } from '../utils/socket'
import { useSelector } from 'react-redux'

const Chat = () => {
    const {target } = useParams()
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const user = useSelector((store) => store.user)
    const userId = user?._id
    
    useEffect(()=>{
      if(!user) return
      const socket = createSocketConnection()
      socket.emit("joinChat", {firstName: user?.firstName, userId, target})

      socket.on("messageReceived", ({firstName, text}) => {
        console.log(text)
        setMessages((messages) => [...messages, {firstName, text}])
      })
      return () => {
        socket.disconnect()
      }
    }, [userId, target])

    const sendMessage = () => {
      const socket = createSocketConnection()
      socket.emit("sendMessage", {
        firstName: user?.firstName,
        userId,
        target,
        text: newMessage
      })
    }
  return (
    <div className='w-1/2 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col'>
      <h1 className='p-5 border-b border-gray-600'> Hack Hearts</h1>
      <div className='flex-1 overflow-scroll p-5'>
        {messages.map((msg, index) => {
            return (
                <div key={index} className="chat chat-start">
  <div className="chat-header">
    {msg.firstName}
    <time className="text-xs opacity-50">2 hours ago</time>
  </div>
  <div className="chat-bubble">{msg.text}</div>
  <div className="chat-footer opacity-50">Seen</div>
</div>
            )
        })}

      </div>
      <div className='p-5 border-t border-gray-600 flex items-center gap-2'>
        <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} type="text" className='flex-1 border border-gray-600 text-white rounded p-2' />
        <button onClick={sendMessage} className='btn btn-secondary'>send</button>
      </div>
    </div>
  )
}

export default Chat
