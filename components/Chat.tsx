// components/Chat.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from "../styles/Chatbox.module.css";

type Message = {
  text: string;
  sender: 'user' | 'bot';
};

interface LineType {
  symbol: string;
  changingTo: string | null;
  color: string;
}

interface ChatProps {
  reading: LineType[];
}

const Chat: React.FC<ChatProps> = ({ reading }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  // const sendMessage = async () => {
  //   if (!input.trim()) return;

  //   const userMessage: Message = { text: input, sender: 'user' };
  //   setMessages((prevMessages) => [...prevMessages, userMessage]);
  //   setInput('');

  //   try {
  //     const response = await axios.post('/api/chat', { prompt: input, reading });
  //     const botMessage: Message = { text: response.data.text, sender: 'bot' };

  //     setMessages((prevMessages) => [...prevMessages, userMessage, botMessage]);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // useEffect(() => {
  //   const sendReading = async () => {
  //     if (reading.length === 6) {
  //       try {
  //         const response = await axios.post('/api/chat', { prompt: input, reading });
  //         const botMessage: Message = { text: response.data.text, sender: 'bot' };
  //         setMessages((prevMessages) => [...prevMessages, botMessage]);
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     }
  //   };

  //   sendReading();
  // }, [reading]);

  return (
    <div className={styles.chat}>
    <div className={styles.messages}>
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>    
      <div style={{ display: 'flex', flexDirection: 'row'}}>
      <input
        type="text"
        className={styles.input}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Ask the Orb'
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage} className={styles.button} disabled={input === ''}>Send</button>
    </div>
    </div>
  );
};

export default Chat;
