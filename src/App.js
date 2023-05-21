import logo from './logo.svg';
import './App.css';
import { useEffect, useRef, useState } from 'react';

function App() {
  const [messages, setMessages] = useState(null)
  const [textMessage, setTextMessage] = useState("")
  const [prevChats, setPrevChats] = useState([])
  const [currentTitle, setCurrentTitle] = useState("")
  const feedRef = useRef()
  
  const getMessages = async () => {
    if(!textMessage?.length) return;
    try {
      const response = await fetch('http://localhost:8000/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textMessage
        })
      })

      const data = await response.json()
      const { choices = [] } = data || {};
      setMessages(choices[0].message)
      // setTextMessage("")
      feedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' });
    } catch (error) {
      console.error(error)
    }
  }


  useEffect(() => {
    if (!currentTitle && textMessage && messages) {
      setCurrentTitle(textMessage)
    }

    if (currentTitle && textMessage && messages) {
      setPrevChats((prevChats => {
       return [...prevChats, {
          title: currentTitle,
          role: 'user',
          content: textMessage
        },
        {
          title: currentTitle,
          role: messages.role,
          content: messages.content
        }]
      }))
    }

  }, [currentTitle, messages])

const currentChat = prevChats?.filter((prevChats=>prevChats.title === currentTitle))
const uniqueTitle = Array.from(new Set(prevChats.map((prev=>prev.title))))

  return (
    <div className="app">
      <section className='side-bar'>
        <button className='btn' onClick={()=>{
          setCurrentTitle("");
          setMessages(null);
          setTextMessage("")

        }}>New Chat</button>
        <ul className='history'>
          {
            uniqueTitle?.map(((title,idx)=>{
              return <li onClick={()=>{
                setCurrentTitle(title)
                setMessages("")
                setTextMessage('')
              }} key={idx}>{title}</li>
            }))
          }
        </ul>
        <nav>
          <p> Made by Vipin</p>
        </nav>
      </section>
      <section className='main'>
        <h1>{!currentTitle ?"Vipin's GPT" : currentTitle } </h1>
        <ul ref={feedRef} className='feed'>
          {
            currentChat?.map(((chat,idx)=>{
              return <li key={idx} className= {chat?.role==='assistant' ? 'chat' : ''}> 
              <div style={{maxWidth:'1000px',margin:'0 auto' ,display:'flex' , gap:'10px',justifyContent:'center',alignItems:'center'}}>
              <p className='role'>{chat.role}</p>
              <p style={{flex:1}}>{chat.content}</p>
              </div>
            
              </li>
            }))
          }
        </ul>
        <div className='bottom-section'>
          <div className='input-container'>
            <input value={textMessage} onChange={(e) => setTextMessage(e.target.value)} />
            <div style={{opacity:textMessage?.length ? 1 : 0.2}}  id='submit' onClick={getMessages}>
              ➢
            </div>
          </div>
          <p className='info'>
            Free Research Preview. ChatGPT may produce inaccurate information about people, places, or facts. ChatGPT May 12 Version
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
