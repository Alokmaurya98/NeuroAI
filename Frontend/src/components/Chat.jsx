/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import './Chat.css'
import { MyContext } from '../MyContext.jsx';
import { useContext,useState,useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';   

function Chat(){
  const{newChat,prevChats,reply}=useContext(MyContext);
  const[latestReply,setLatestReply]=useState(null);
  useEffect(() => {
  if (!reply || typeof reply !== "string") return;
  if (!prevChats || prevChats.length === 0) return;

  const content = reply.split(" ");
  let idx = 0;

  const interval = setInterval(() => {
    setLatestReply(content.slice(0, idx + 1).join(" "));
    idx++;
    if (idx >= content.length) clearInterval(interval);
  }, 40);

  return () => clearInterval(interval);
}, [prevChats, reply]);

  return (
    <>
    {newChat&&<h1>What's up buddy ! What's on your Mind Today </h1>}
    <div className="chats">
      {
        prevChats?.slice(0,-1).map((chat,index)=>
        <div className={chat.role==="user"? "userDiv":"gptDiv"} key={index}>
          {
          chat.role==="user" ?
          <p className="userMessage">{chat.content}</p>
          :
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
  {chat.content}
</ReactMarkdown>

          }
        </div>
        )
      }
      {
        prevChats&&prevChats.length>0&&latestReply!=null&&
        <div className="gptDiv">
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
  {latestReply}
</ReactMarkdown>

        </div>
      }
    </div>
     </>
  )
}
export default Chat;