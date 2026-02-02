/* eslint-disable no-unused-vars */
import './ChatWindow.css'
import Chat from './Chat.jsx'
import { MyContext } from '../MyContext.jsx';
import { useContext ,useState,useEffect} from 'react';
import RingLoader from "react-spinners/RingLoader";

function ChatWindow(){
  const { prompt, setPrompt, reply, setReply, currThreadId ,prevChats,setPrevChats} = useContext(MyContext);
  const[loading,setLoading]=useState(false);
  const getReply=async()=>{
    setLoading(true);
    const options={
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        message:prompt,
        threadId:currThreadId
      })
    };
    try{
      const response = await fetch(
  `${import.meta.env.VITE_API_BASE_URL}/api/chat`,
  options
);
      const data=await response.json();
    if (!response.ok) {
      console.error(data.error);
      return;
    }
    setReply(data.reply);
    }catch(err){
      console.log(err);
    }
     
    finally {
    setLoading(false); 
    }
  }
  //Append New Chats to Previous Chats
  useEffect(()=>{
    if(prompt&&reply){
      setPrevChats(prevChats => [
  ...prevChats,
  {
    role: "user",
    content: prompt
  },
  {
    role: "assistant",
    content: reply
  }
]);

    }
    setPrompt("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[reply])
  return (
     <div className="chatWindow">
            <div className="navbar">
                <span>NeuroAI <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv">
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            
            <Chat></Chat>
            <RingLoader color="#3b138b" loading={loading}>  </RingLoader>
            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything"
                       value={prompt}
                        onChange={(e)=>setPrompt(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') getReply(); }}
                    >
                           
                    </input>
                    <div id="submit" onClick={getReply} ><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">
                    Powered by NeuroAI
                </p>
            </div>
        </div>
  )
}
export default ChatWindow;