
import './App.css'
import Sidebar from './components/Sidebar.jsx'
import ChatWindow from './components/ChatWindow.jsx'
import { MyContext } from './MyContext.jsx';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';
function App() {
  const [prompt,setPrompt]=useState("");
  const[reply,setReply]=useState("");
  const [currThreadId,setCurrThreadId]=useState(uuid());
  const[prevChats,setPrevChats]=useState([]);
  const[newChat,setNewChat]=useState(true);
 const providerValue={
  prompt,setPrompt,
  reply,setReply,
  currThreadId,setCurrThreadId ,
  prevChats,setPrevChats,
  newChat,setNewChat
 }
  return (
    <div className="app">
    <MyContext.Provider value={providerValue}>
     <Sidebar />
     <ChatWindow />
     </MyContext.Provider>
    </div>
  )
}

export default App
