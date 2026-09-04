"use client"

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/translations';

export default function HandwrittenMessage() {
  const t = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [name, setName] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' as 'success' | 'error' | 'info' | '' });
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentWidth, setCurrentWidth] = useState(3);
  const [history, setHistory] = useState<string[]>([]);
  const [messageType, setMessageType] = useState<'drawn' | 'written'>('drawn');
  const [writtenText, setWrittenText] = useState('');

  // Pen color options with translations
  const penColors = [
    { color: '#000000', name: t('colorBlack') },
    { color: '#EF4444', name: t('colorRed') },
    { color: '#3B82F6', name: t('colorBlue') },
    { color: '#10B981', name: t('colorGreen') },
    { color: '#8B5CF6', name: t('colorPurple') },
    { color: '#F59E0B', name: t('colorOrange') },
  ];

  // Pen width options with translations
  const penWidths = [
    { width: 2, name: t('widthThin') },
    { width: 3, name: t('widthMedium') },
    { width: 5, name: t('widthThick') },
    { width: 8, name: t('widthBold') },
  ];

  // Re-initialize canvas and context when messageType changes back to 'drawn'
  useEffect(() => {
    if (messageType !== 'drawn') return;

    const initCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      // Set canvas size based on container
      const container = canvas.parentElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        canvas.width = Math.min(1000, rect.width * 0.95);
        canvas.height = 600;
      }

      // Restore background
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Restore drawing styles
      context.lineWidth = currentWidth;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = currentColor;

      // Restore last state from history if it exists
      if (history.length > 0) {
        const img = new Image();
        img.onload = () => {
          context.drawImage(img, 0, 0);
        };
        img.src = history[history.length - 1];
      }

      setCtx(context);
    };

    // Use a small timeout to ensure DOM is ready after mode switch
    const timer = setTimeout(initCanvas, 50);

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const container = canvas.parentElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        const newWidth = Math.min(1000, rect.width * 0.95);
        if (Math.abs(canvas.width - newWidth) > 10) {
          // Note: Simple resize clears canvas, but initCanvas/history handles restoration
          initCanvas();
        }
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [messageType]); // Only depends on messageType to trigger re-init

  // Update drawing context when color or width changes
  useEffect(() => {
    if (ctx) {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = currentWidth;
    }
  }, [currentColor, currentWidth, ctx]);

  // Refs for drawing state
  const points = useRef<Array<{x: number, y: number, pressure: number}>>([]);
  const rafId = useRef<number | null>(null);
  const lastWidth = useRef(currentWidth);
  const hasDrawn = useRef(false);
  const hasSavedInitialState = useRef(false);
  const canvasStateBeforeDrawing = useRef<ImageData | null>(null);
  const isProcessingStop = useRef(false);
  const hasSavedToHistory = useRef(false);
  const lastTouchTime = useRef(0);

  const getPressure = (e: Touch | MouseEvent | React.Touch | React.MouseEvent): number => {
    // Check if the device supports pressure (like iPad with Apple Pencil)
    const event = e as any; // Type assertion to access force property
    if ('force' in event && event.force) {
      return Math.min(Math.max(event.force, 0.1), 1);
    }
    return 0.5; // Default pressure
  };

  const drawSmoothLine = () => {
    if (!canvasRef.current || points.current.length < 3) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const pointsToDraw = [...points.current];
    
    ctx.beginPath();
    ctx.moveTo(pointsToDraw[0].x, pointsToDraw[0].y);
    
    // Draw a smooth curve through the points
    for (let i = 1; i < pointsToDraw.length - 2; i++) {
      const xc = (pointsToDraw[i].x + pointsToDraw[i + 1].x) / 2;
      const yc = (pointsToDraw[i].y + pointsToDraw[i + 1].y) / 2;
      ctx.quadraticCurveTo(pointsToDraw[i].x, pointsToDraw[i].y, xc, yc);
    }
    
    // Connect the last two points
    if (pointsToDraw.length > 1) {
      const i = pointsToDraw.length - 2;
      ctx.quadraticCurveTo(
        pointsToDraw[i].x, 
        pointsToDraw[i].y, 
        pointsToDraw[i + 1].x, 
        pointsToDraw[i + 1].y
      );
    }
    
    // Use the average pressure of the points for the line width
    const avgPressure = pointsToDraw.reduce((sum, p) => sum + p.pressure, 0) / pointsToDraw.length;
    const targetWidth = currentWidth * (0.5 + avgPressure * 0.5);
    
    // Smooth width transition
    const width = lastWidth.current + (targetWidth - lastWidth.current) * 0.3;
    lastWidth.current = width;
    
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const getCanvasCoordinates = (
    e: MouseEvent | React.MouseEvent<HTMLCanvasElement> | 
       Touch | React.TouchEvent<HTMLCanvasElement> | 
       { clientX: number; clientY: number }
  ) => {
  if (!canvasRef.current) return null;
  
  const canvas = canvasRef.current;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  let clientX: number;
  let clientY: number;

  // Handle different event types
  if ('touches' in e && e.touches) {
    // It's a TouchEvent with touches array
    const touch = e.touches[0];
    clientX = touch.clientX;
    clientY = touch.clientY;
  } else if ('clientX' in e) {
    // It's a MouseEvent, Touch object, or similar
    clientX = e.clientX;
    clientY = e.clientY;
  } else if ('nativeEvent' in e) {
    // Handle React synthetic events
    const nativeEvent = e.nativeEvent as MouseEvent | TouchEvent;
    if ('touches' in nativeEvent && nativeEvent.touches.length > 0) {
      clientX = nativeEvent.touches[0].clientX;
      clientY = nativeEvent.touches[0].clientY;
    } else if ('clientX' in nativeEvent) {
      clientX = nativeEvent.clientX;
      clientY = nativeEvent.clientY;
    } else {
      return null;
    }
  } else {
    return null;
  }
  
  const x = (clientX - rect.left) * scaleX;
  const y = (clientY - rect.top) * scaleY;
  
  return { x, y };
};

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    // Prevent mouse events if touch event just fired (mobile browsers fire both)
    if ('touches' in e) {
      lastTouchTime.current = Date.now();
    } else {
      // If this is a mouse event within 500ms of a touch event, ignore it
      if (Date.now() - lastTouchTime.current < 500) {
        return;
      }
    }
    
    e.preventDefault();
    if (!canvasRef.current) return;
    
    const coords = getCanvasCoordinates('touches' in e ? e.touches[0] : e.nativeEvent);
    if (!coords) return;
    
    // Save the current canvas state before we start drawing
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      canvasStateBeforeDrawing.current = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    
    const pressure = getPressure('touches' in e ? e.touches[0] : e.nativeEvent);
    points.current = [{ x: coords.x, y: coords.y, pressure }];
    hasDrawn.current = false;
    hasSavedInitialState.current = false;
    isProcessingStop.current = false;
    hasSavedToHistory.current = false;
    setIsDrawing(true);
    
    // Start the drawing loop
    const drawLoop = () => {
      // Only draw if we have at least 3 points (a real stroke, not just a tap)
      if (points.current.length >= 3) {
        drawSmoothLine();
        // Save initial state after first actual draw
        if (!hasSavedInitialState.current && canvasRef.current) {
          hasSavedInitialState.current = true;
        }
        // Keep only the last few points to maintain performance
        if (points.current.length > 10) {
          points.current = points.current.slice(-10);
        }
      }
      rafId.current = requestAnimationFrame(drawLoop);
    };
    
    rafId.current = requestAnimationFrame(drawLoop);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    // Prevent mouse events if touch event just fired
    if ('touches' in e) {
      lastTouchTime.current = Date.now();
    } else {
      if (Date.now() - lastTouchTime.current < 500) {
        return;
      }
    }
    
    e.preventDefault();
    if (!isDrawing || !canvasRef.current) return;
    
    const coords = getCanvasCoordinates('touches' in e ? e.touches[0] : e.nativeEvent);
    if (!coords) return;
    
    const pressure = getPressure('touches' in e ? e.touches[0] : e.nativeEvent);
    
    // Add the new point with scaled coordinates
    points.current.push({ x: coords.x, y: coords.y, pressure });
    hasDrawn.current = true;
  };

  const stopDrawing = (e?: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    // Prevent mouse events if touch event just fired
    if (e) {
      if ('touches' in e || 'changedTouches' in e) {
        lastTouchTime.current = Date.now();
      } else {
        if (Date.now() - lastTouchTime.current < 500) {
          return;
        }
      }
    }
    
    // Guard against double execution
    if (!isDrawing || isProcessingStop.current) return;
    
    // Mark that we're processing to prevent re-entry
    isProcessingStop.current = true;
    
    // Set isDrawing to false to prevent any further operations
    setIsDrawing(false);
    
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    
    if (!canvasRef.current || points.current.length === 0) {
      points.current = [];
      hasDrawn.current = false;
      hasSavedInitialState.current = false;
      canvasStateBeforeDrawing.current = null;
      isProcessingStop.current = false;
      return;
    }
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx || !canvasStateBeforeDrawing.current) {
      points.current = [];
      hasDrawn.current = false;
      hasSavedInitialState.current = false;
      canvasStateBeforeDrawing.current = null;
      isProcessingStop.current = false;
      return;
    }
    
    // Determine if this was a dot (tap) or a stroke (drag)
    const isDot = points.current.length < 3;
    
    if (isDot) {
      // It's a dot - restore canvas to clean state first
      ctx.putImageData(canvasStateBeforeDrawing.current, 0, 0);
      // Now draw a clean dot
      const point = points.current[0];
      ctx.beginPath();
      ctx.arc(point.x, point.y, currentWidth / 2, 0, Math.PI * 2);
      ctx.fillStyle = currentColor;
      ctx.fill();
    }
    
    // Save to history exactly once per drawing session
    // Use requestAnimationFrame to ensure canvas is fully rendered
    if (!hasSavedToHistory.current) {
      hasSavedToHistory.current = true;
      requestAnimationFrame(() => {
        if (canvasRef.current) {
          const dataUrl = canvasRef.current.toDataURL();
          setHistory(prev => [...prev, dataUrl]);
        }
      });
    }
    
    // Clean up
    points.current = [];
    hasDrawn.current = false;
    hasSavedInitialState.current = false;
    canvasStateBeforeDrawing.current = null;
    isProcessingStop.current = false;
  };

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHistory([]);
  };

  const undoLastStroke = () => {
    if (!canvasRef.current || !ctx || history.length === 0) return;
    
    // Remove the last state from history
    const newHistory = [...history];
    newHistory.pop();
    setHistory(newHistory);
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // If there's a previous state, restore it
    if (newHistory.length > 0) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = newHistory[newHistory.length - 1];
    }
  };

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setMessage({ text: t('messageError'), type: 'error' });
      return;
    }

    // Validate based on message type
    if (messageType === 'drawn') {
      if (!canvasRef.current) {
        setMessage({ text: t('messageError'), type: 'error' });
        return;
      }
    } else {
      if (!writtenText.trim()) {
        setMessage({ text: t('messageError'), type: 'error' });
        return;
      }
    }

    setIsSending(true);
    setMessage({ text: t('sendingMessage'), type: 'info' });

    try {
      // Create form data
      const formData = new FormData();
      formData.append('name', name.trim());
      
      if (messageType === 'drawn') {
        // Convert canvas to blob for drawn messages
        const blob = await new Promise<Blob | null>((resolve) => {
          canvasRef.current?.toBlob((blob) => {
            resolve(blob);
          }, 'image/png');
        });

        if (!blob) {
          throw new Error('Failed to create image from drawing');
        }

        formData.append('message', 'A new drawn message from the engagement website');
        formData.append('image', blob, 'drawing.png');
      } else {
        // Send text message for written messages
        formData.append('message', writtenText.trim());
        formData.append('textMessage', writtenText.trim());
      }

      // Send data to API route
      const response = await fetch('/api/send-email', {
        method: 'POST',
        body: formData,
      });

      // Try to parse JSON; if not JSON, fall back to text for better error visibility
      const contentType = response.headers.get('content-type') || '';
      let responseData: any = null;
      if (contentType.includes('application/json')) {
        try {
          responseData = await response.json();
        } catch (e) {
          console.error('Failed to parse JSON response:', e);
          const rawText = await response.text().catch(() => '');
          responseData = { raw: rawText };
        }
      } else {
        const rawText = await response.text().catch(() => '');
        responseData = { raw: rawText };
      }

      if (!response.ok) {
        console.error('Server error:', response.status, response.statusText, responseData);
        const msg = responseData?.message
          || responseData?.error
          || (typeof responseData?.raw === 'string' && responseData.raw.trim() ? responseData.raw : '')
          || 'Failed to send message';
        throw new Error(msg);
      }

      if (!responseData.success) {
        console.error('API error:', responseData);
        throw new Error(responseData.message || 'Message sending failed');
      }

      setMessage({ 
        text: t('messageSent'),
        type: 'success' as const
      });
      
      // Reset form if successful
      if (messageType === 'drawn') {
        clearCanvas();
        setHistory([]);
      } else {
        setWrittenText('');
      }
      setName('');
      
    } catch (error) {
      console.error('Error sending message:', error);
      setMessage({ 
        text: error instanceof Error ? error.message : t('messageError'), 
        type: 'error' 
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section 
      id="message" 
      className="py-16 px-4 md:py-20 bg-gradient-to-b from-background to-accent/5 select-none overflow-x-hidden"
      style={{
        clipPath: 'polygon(0 3%, 100% 0%, 100% 97%, 0% 100%)',
      }}
    >
      <div className="max-w-4xl mx-auto w-full"> {/* Increased max width */}
        <motion.div 
          className="text-center mb-12 select-none"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { 
                duration: 0.8, 
                ease: [0.22, 1, 0.36, 1] 
              }
            }
          }}
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </motion.div>
            <div className="w-24 h-px bg-gradient-to-l from-transparent via-accent to-transparent" />
          </div>
          <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl font-medium mb-4 select-none">{t('writeUsMessage')}</h2>
          <p className="font-luxury text-xl md:text-2xl text-muted-foreground mb-8 italic max-w-2xl mx-auto select-none">{t('writeUsDescription')}</p>
          
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-card/95 via-card/90 to-accent/10 backdrop-blur-sm border-4 border-accent/40 p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl select-none relative overflow-hidden">
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-accent/20 rounded-tl-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-accent/20 rounded-br-3xl pointer-events-none" />
              
              {/* Message Type Tabs */}
              <div className="flex gap-4 mb-10 justify-center relative z-10">
                <button
                  type="button"
                  onClick={() => setMessageType('drawn')}
                  className={`px-6 py-3 text-base md:text-lg font-luxury rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 border-2 ${
                    messageType === 'drawn'
                      ? 'bg-accent text-white border-accent'
                      : 'bg-background/50 text-foreground border-accent/30 hover:border-accent/60'
                  }`}
                >
                  {t('drawnMessage')}
                </button>
                <button
                  type="button"
                  onClick={() => setMessageType('written')}
                  className={`px-6 py-3 text-base md:text-lg font-luxury rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 border-2 ${
                    messageType === 'written'
                      ? 'bg-accent text-white border-accent'
                      : 'bg-background/50 text-foreground border-accent/30 hover:border-accent/60'
                  }`}
                >
                  {t('writtenMessage')}
                </button>
              </div>

              {/* Drawn Message Section */}
              {messageType === 'drawn' && (
                <div className="relative z-10">
                  <p className="font-luxury text-lg text-muted-foreground italic mb-6 select-none">
                    {t('yourMessage')}...
                  </p>
                  
                  {/* Pen Options */}
                  <div className="mb-8 p-4 bg-background/40 backdrop-blur-sm rounded-2xl border border-accent/20">
                    <div className="flex flex-wrap gap-6 justify-center">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-luxury text-foreground/70">{t('color')}:</span>
                        <div className="flex gap-2">
                          {penColors.map((pen) => (
                            <button
                              key={pen.color}
                              type="button"
                              onClick={() => setCurrentColor(pen.color)}
                              className={`w-7 h-7 rounded-full transition-transform hover:scale-125 border-2 ${
                                currentColor === pen.color ? 'border-accent scale-110 shadow-md' : 'border-transparent'
                              }`}
                              style={{ backgroundColor: pen.color }}
                              title={pen.name}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-luxury text-foreground/70">{t('width')}:</span>
                        <div className="flex gap-2">
                          {penWidths.map((pen) => (
                            <button
                              key={pen.width}
                              type="button"
                              onClick={() => setCurrentWidth(pen.width)}
                              className={`px-3 py-1 text-xs font-luxury rounded-full transition-all ${
                                currentWidth === pen.width
                                  ? 'bg-accent text-white shadow-sm'
                                  : 'bg-background/60 text-foreground/70 hover:bg-accent/10 border border-accent/20'
                              }`}
                            >
                              {pen.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="relative bg-white border-4 border-accent/30 rounded-2xl overflow-hidden mb-8 shadow-inner select-none"
                    style={{
                      WebkitUserSelect: 'none',
                      userSelect: 'none',
                      WebkitTapHighlightColor: 'rgba(0,0,0,0)'
                    }}
                  >
                    <canvas
                      ref={canvasRef}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      onTouchCancel={stopDrawing}
                      className="w-full h-[400px] touch-none cursor-crosshair select-none"
                      style={{
                        touchAction: 'none',
                        WebkitUserSelect: 'none',
                        userSelect: 'none',
                        WebkitTapHighlightColor: 'rgba(0,0,0,0)'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Written Message Section */}
              {messageType === 'written' && (
                <div className="mb-8 relative z-10">
                  <textarea
                    value={writtenText}
                    onChange={(e) => setWrittenText(e.target.value)}
                    placeholder={t('writeYourMessage')}
                    rows={8}
                    className="w-full px-6 py-4 bg-background/50 border-2 border-accent/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all font-luxury text-lg resize-none shadow-inner"
                    required={messageType === 'written'}
                  />
                </div>
              )}

              <form onSubmit={sendEmail} className="space-y-6 relative z-10">
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('yourName')}
                    className="w-full px-6 py-4 bg-background/50 border-2 border-accent/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all font-luxury text-lg shadow-inner"
                    required
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-4">
                  <div className="flex gap-2">
                    {(messageType === 'drawn' || (messageType === 'written' && writtenText.trim())) && (
                      <button
                        type="button"
                        onClick={messageType === 'drawn' ? undoLastStroke : () => setWrittenText('')}
                        className="flex-1 sm:flex-none px-6 py-3 font-luxury text-sm bg-background/60 text-foreground/70 border-2 border-accent/20 rounded-full hover:bg-accent/10 transition-all disabled:opacity-50"
                        disabled={isSending || (messageType === 'drawn' && history.length === 0)}
                      >
                        {messageType === 'drawn' ? t('undo') : t('clearDrawing')}
                      </button>
                    )}
                    {messageType === 'drawn' && (
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="flex-1 sm:flex-none px-6 py-3 font-luxury text-sm bg-background/60 text-foreground/70 border-2 border-accent/20 rounded-full hover:bg-accent/10 transition-all"
                        disabled={isSending}
                      >
                        {t('clearDrawing')}
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-10 py-4 text-white bg-accent rounded-full hover:bg-accent/90 disabled:opacity-50 transition-all font-luxury text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 whitespace-nowrap"
                    disabled={isSending}
                  >
                    {isSending ? t('sendingMessage') : t('sendMessage')}
                  </button>
                </div>

                {message.text && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`mt-6 p-4 rounded-2xl text-center font-luxury border-2 ${
                      message.type === 'error' ? 'bg-red-50/80 text-red-700 border-red-200' : 
                      message.type === 'info' ? 'bg-blue-50/80 text-blue-700 border-blue-200' : 
                      'bg-green-50/80 text-green-700 border-green-200'
                    }`}
                  >
                    {message.text}
                  </motion.div>
                )}
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
