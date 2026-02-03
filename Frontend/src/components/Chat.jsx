import "./Chat.css";
import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "../MyContext.jsx";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
    const {newChat, prevChats, reply} = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);

    useEffect(() => {
        if(reply === null) {
            setLatestReply(null); //prevchat load
            return;
        }

        if(!Array.isArray(prevChats) || !prevChats.length) return;

        if(typeof reply !== 'string') return;

        const content = reply.split(" "); //individual words

        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx+1).join(" "));

            idx++;
            if(idx >= content.length) clearInterval(interval);
        }, 40);

        return () => clearInterval(interval);

    }, [prevChats, reply])

    return (
        <div className={`chatContainer ${newChat ? 'welcome' : ''}`}>
            {newChat && <h1>Hey Buddy! What's on your Mind Today</h1>}
            <div className="chats">
                {
                    (Array.isArray(prevChats) ? prevChats.slice(0, -1) : []).map((chat, idx) =>
                        <div className={chat.role === "user"? "userDiv" : "gptDiv"} key={idx}>
                            {chat.role === "assistant" && <div className="avatar gptAvatar">AI</div>}
                            {
                                chat.role === "user"?
                                <>
                                    <p className="userMessage">{chat.content}</p>
                                    <div className="avatar userAvatar">U</div>
                                </> :
                                <ReactMarkdown className="gptMessage" rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                            }
                        </div>
                    )
                }

               {
  Array.isArray(prevChats) && prevChats.length > 0 && (
    <>
      {latestReply === null ? (
        <div className="gptDiv" key="non-typing">
          <div className="avatar gptAvatar">AI</div>
          <div className="gptMessage">
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {prevChats[prevChats.length - 1].content}
            </ReactMarkdown>
          </div>
        </div>
      ) : (
        <div className="gptDiv typing" key="typing">
          <div className="avatar gptAvatar">AI</div>
          <div className="gptMessage">
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {latestReply}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </>
  )
}

            </div>
        </div>
    )
}

export default Chat;
