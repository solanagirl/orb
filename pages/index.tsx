import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { generateReading, getCoinFlipLine, mapLinesToHexagramDetails } from "@/src/generateReading";

interface LineType {
    symbol: string;
    changingTo: string | null;
    color: string;
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hexagram, setHexagram] = useState<LineType[]>([]);
  const [reading, setReading] = useState<any | null>(null);
  const [primaryColor, setPrimaryColor] = useState<string>('#a17fe0');

function drawLine(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number
) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}

const drawLineAnimated = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  color: string,
  shadowColor: string,
  duration: number
) => {
  const startTime = performance.now();
  const draw = (currentTime: number) => {
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const x = startX + (endX - startX) * progress;

    ctx.strokeStyle = color;
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = 10;
    ctx.lineWidth = 10;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(x, endY);
    ctx.stroke();

    if (progress < 1) {
      requestAnimationFrame(draw);
    }
  };
  requestAnimationFrame(draw);
};

function drawHexagram(hexagram: LineType[]) {
  const canvas = canvasRef.current!;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clears the canvas for a new drawing

  // Setup the glow effect for all lines
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 8;
  ctx.shadowOffsetY = 0;

  const lineSpacing = 40;
  const baseY = canvas.height - 50; // Start from the bottom of the canvas
  const midPoint = canvas.width / 2;
  const lineLength = 100;
  const halfLineLength = lineLength / 2;
  const gap = 20;

  hexagram.forEach((line, index) => {
    const startY = baseY - index * lineSpacing;

    let shadowColor = '#000000'; // Default shadow color for lines
    // Apply shadow color for each line based on its type
    if (line.symbol.includes('Yin') && line.symbol.startsWith('Young')) {
      shadowColor = '#6e47c9';
    } else if (line.symbol.includes('Yin') && line.symbol.startsWith('Old')) {
      shadowColor = '#7fbbf0';
    } else if (line.symbol.includes('Yang') && line.symbol.startsWith('Young')) {
      shadowColor = '#ff8533';
    } else if (line.symbol.includes('Yang') && line.symbol.startsWith('Old')) {
      shadowColor = '#991150';
    }

    setPrimaryColor(shadowColor);
    updateCanvasGlow(ctx, hexagram);
    console.log('drawhex', shadowColor);

    ctx.shadowColor = shadowColor;

    ctx.lineWidth = 10;
    ctx.strokeStyle = line.color;

    // Draw only the last added line with animation
    if (index === hexagram.length - 1) {
      if (line.symbol.includes('Yin')) {
        drawLineAnimated(ctx, midPoint - halfLineLength, startY, midPoint - gap / 2, startY, line.color, shadowColor, 500);
        drawLineAnimated(ctx, midPoint + gap / 2, startY, midPoint + halfLineLength, startY, line.color, shadowColor, 500);
      } else {
        drawLineAnimated(ctx, midPoint - halfLineLength, startY, midPoint + halfLineLength, startY, line.color, shadowColor, 500);
      }
    } else {
      // Draw static lines for previously added lines
      if (line.symbol.includes('Yin')) {
        drawLine(ctx, midPoint - halfLineLength, startY, midPoint - gap / 2, startY);
        drawLine(ctx, midPoint + gap / 2, startY, midPoint + halfLineLength, startY);
      } else {
        drawLine(ctx, midPoint - halfLineLength, startY, midPoint + halfLineLength, startY);
      }
    }
  });
}

function updateCanvasGlow(ctx: CanvasRenderingContext2D, hexagram: LineType[]) {
    // Initialize base colors with vibrant and magical defaults
    let baseGlow = primaryColor;  
    let secondaryGlow = '#FFD700';  
    let tertiaryGlow = '#FF69B4';  

    // Adjust colors dynamically based on line properties
    hexagram.forEach(line => {
        if (line.symbol.startsWith('Old')) {
            secondaryGlow = '#ff7d69';  // Chartreuse, vibrant and visually striking
            tertiaryGlow = '#00BFFF';  // Deep Sky Blue for depth and energy
        } else if (line.symbol.startsWith('Young')) {
            secondaryGlow = '#efadff';  // Medium Orchid for youthful energy
            tertiaryGlow = '#ffe4a8';  // Medium Spring Green for freshness and new beginnings
        }
    });

    // Create dynamic visual effects based on the amalgamation of all line types
    const intensity = hexagram.reduce((acc, line) => acc + (line.symbol.startsWith('Old') ? 2 : 1), 1);
    const blurRadius = 5 + intensity;  // Increase blur radius based on the intensity

    // Update the canvas glow dynamically with multiple colors
    ctx.canvas.style.boxShadow = `
        0 0 ${blurRadius}px ${baseGlow}, /* Primary dynamic glow based on line type */
        0 0 ${blurRadius * 1.5}px ${secondaryGlow}, /* Secondary vibrant glow for consistency */
        0 0 ${blurRadius * 2}px ${tertiaryGlow}, /* Tertiary magical glow for depth */
        0 0 ${blurRadius * 2.5}px ${baseGlow} inset, /* Inner glow matching the primary */
        0 0 ${blurRadius * 3}px ${secondaryGlow} inset /* Inner secondary glow for a rich effect */
    `;
}
  const nextStep = () => {
    if (hexagram.length < 6) {
      const newLine = getCoinFlipLine();
      const newHexagram = [...hexagram, newLine];
      setHexagram(newHexagram);
      drawHexagram(newHexagram);
      console.log(newHexagram);
      if (newHexagram.length === 6) {
        const newReading = mapLinesToHexagramDetails(newHexagram);
        console.log(newReading)
        setReading(newReading);
      }
    } else {
      setReading(null);
      setHexagram([]);
    }
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <title>Ask the Orb</title>
        <link rel="stylesheet" href="styles.css" />
      </Head>
      <main id={styles.main}>
        <div style={{ width: "100%", display: "flex", justifyContent: 'flex-end', marginRight: '64px', marginTop: '36px'}}>
        <WalletMultiButton />
          </div>
        <div id={styles.overlay}>
          {
            reading?.advice ? (
              <div style={{ width: '100%', display: "flex", flexDirection: 'row', flexWrap: 'wrap', gap: '8px', justifyItems: "justify-between", alignItems: 'center'}}>
                <p>{ reading.changing.length } changing lines.</p>
                <p style={{ width: '100%', flexBasis: 1, flexShrink: 1, textWrap: 'nowrap', overflow: 'clip', overflowClipMargin: '12px', overflowClipBox: "padding-box"}}>{reading.advice}...</p>
                <a href={'https://dial.to/?action=solana-action:https://orb.vercel.app/api/actions'} target="_blank" rel="no-referrer">Donate</a>
              </div>
            ) : (
              <p></p>
            )
          }
        </div>
        <div id={styles.container}>
          <canvas id={styles.canvas} ref={canvasRef} onClick={nextStep} width="300" height="300"></canvas>
        </div>
        <div>
        { reading ? (
          <div style={{ width: '100%', height: '100%', display: "flex", flexDirection: 'column', justifyItems: 'center', alignItems: 'center'}}>
            <p className={styles.title} style={{ textShadow: `0 0 8px #ffffff, 0 0 45px ${primaryColor}`, textAlign: "center", fontFamily: "Bonsad"}}>{reading.id ? `No.${reading.id}:${reading.chinese_name}` : 'Waiting for Interpretation'}</p>
            <p className={styles.title} style={{ textShadow: `0 0 8px #ffffff, 0 0 45px ${primaryColor}`, textAlign: "center"}}>{reading ? reading.name : 'Ask the Orb'}</p>
            <div style={{ width: "40%", display: "flex", flexDirection: 'column', justifyItems: 'center', alignItems: 'center', gap: '24px'}}>
            <div>
            {reading.keywords?.map((keyword: String, index: React.Key) => (
                <span key={index} className={styles.keyword_bubble}>
                    {keyword}
                </span>
              ))}
              </div>
            <div className={styles.description}>{reading.creative_description} {reading.overall_meaning}</div>
            {
              reading.changing?.map((line: any) => {
                return <p style={{ width: '100%', flexBasis: 1, flexShrink: 1, textWrap: 'nowrap', overflow: 'clip', overflowClipMargin: '12px', overflowClipBox: "padding-box"}}>Line {line.line_number}: {line.text}</p>
              })
                }
            </div>
          </div>
          ): (
            <p className={styles.title} style={{ textShadow: `0 0 8px #ffffff, 0 0 45px ${primaryColor}`, textAlign: "center", userSelect: "none", padding: '10%'}}>Ask the Orb with intention</p>
          )}
            </div>
          {/* <div >
              {
                reading ? (
                  <div className={styles.chat}>
                  <div>
                  </div>
                  <div className={styles.description}>{reading.creative_description}</div>
                  <div className={styles.meaning}>{reading.overall_meaning}</div>
                  <div className={styles.advice} style={{ color: primaryColor}}>Advice: {reading.advice}</div>
                  <div>
                      {reading.changing?.map((line: any) => {
                        if (line === undefined) {
                          return;
                        }
                        return (
                          <div>
                            Changing Line {line.line_number}:
                            <div className={styles.description}>{line.text}</div>
                            <div className={styles.description}>{line.interpretation}</div>
                          </div>
                        )
                      })}
                    </div>
                 </div>
                ) : (
                  <div>
                  </div>
                )
              }
          </div> */}
      </main>
    </>
  );
}
