import { useEffect, useState } from "react";
import { SiCodemagic } from "react-icons/si";
import dynamic from 'next/dynamic';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);


export function Navbar() {
    const [currentTime, setCurrentTime] = useState<any>();

    function updateTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        setCurrentTime(timeString);
      }
    
      useEffect(() => {
        const interval = setInterval(updateTime, 1000);
        updateTime();
        return () => clearInterval(interval); // Clear the interval on component unmount
      }, []);
    
    
    return (
        <div className="navbar">
          <p className="title">Ask the Orb</p>
            <div style={{ display: 'flex', gap: '12px'}}>
              <a style={{ display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer'}}>
                <SiCodemagic />
                <p>Home</p>
              </a>
              <a style={{ display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer'}}>
                <SiCodemagic />
                <p>About</p>
              </a>
            </div>
            <WalletMultiButtonDynamic />
        <style jsx>{`
            .navbar {
            position: absolute;
            top: 0;
            height: 60px;
            width: 100%;
            max-width: 100vw;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            background-color: #1a1a2e;
            color: #c4b96c; // Magical gold
            font-family: 'Bonsad';
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
            z-index: 80;
            margin-top: 8vh;
            margin-bottom: 20px;
            gap: 8px;
            border-top: 1px solid #bb99ff;
            }
            
            .navbar a {
            text-decoration: none;
            font-size: 18px;
            font-family: 'Roboto Slab', serif;
            transition: color 0.3s ease, transform 0.3s ease;
            }

            .navbar a:hover, .navbar a:focus {
            color: #FFFFFF;
            transform: scale(1.1);
            text-shadow: 0 0 10px #FFFFFF;
            }
            .title {
              position: absolute;
              color: #a17fe0;
              font-size: 4em; 
              margin-top: -14vh;          
          }          
        `}</style>
        </div>
    );
  }