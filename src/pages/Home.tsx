import { useState, useEffect, useRef } from 'react';
import { 
  Sliders, Palette, Zap, Sparkles, Wifi, 
  Search, Mic, MicOff, Volume2, Settings, RefreshCw 
} from 'lucide-react';
import { processLEDCommand } from '../services/ledControlAI';
import '../styles/Dashboard.css';

// Add type declarations for Web Speech API
interface Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

const Home = () => {
  // Existing LED control states
  const [brightness, setBrightness] = useState(50);
  const [color, setColor] = useState('#ff0000');
  const [animation, setAnimation] = useState(0);
  const [speed, setSpeed] = useState(50);
  const [connected, setConnected] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  const [aiCommand, setAiCommand] = useState('');
  const [status, setStatus] = useState('');
  const [showStatus, setShowStatus] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [polling, setPolling] = useState<NodeJS.Timeout | null>(null);
  
  // New states for enhanced features
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState<{ip: string, name: string}[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  
  // Initialize speech recognition if available
  useEffect(() => {
    // Check if browser supports SpeechRecognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        setTranscript(transcript);
        
        // If we have a final result, process it
        if (event.results[0].isFinal) {
          setAiCommand(transcript);
          setTimeout(() => {
            setIsListening(false);
            sendAICommand(transcript);
          }, 1000);
        }
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        displayStatus(`Microphone error: ${event.error}`, 'error');
      };
    }
  }, []);

  // Function to scan for ESP32 devices on the local network
  const scanForDevices = async () => {
    setScanning(true);
    displayStatus('Scanning for LED controllers...', 'info');
    setDevices([]);
    
    // Get the base IP from the current origin or a default
    let baseIP = '192.168.1';
    try {
      const currentIP = window.location.hostname;
      if (currentIP !== 'localhost' && /^\d+\.\d+\.\d+\.\d+$/.test(currentIP)) {
        baseIP = currentIP.split('.').slice(0, 3).join('.');
      }
    } catch (error) {
      console.error('Error getting local IP:', error);
    }
    
    const foundDevices: {ip: string, name: string}[] = [];
    const promises = [];
    
    // Scan a range of IPs
    for (let i = 1; i <= 255; i++) {
      const ip = `${baseIP}.${i}`;
      const promise = fetch(`http://${ip}/`, { 
        method: 'GET',
        mode: 'no-cors', // This allows requests to be sent but response can't be read
        signal: AbortSignal.timeout(500) // 500ms timeout
      })
      .then(() => {
        // We can't read the response with no-cors, but if it doesn't throw,
        // there's likely a server there - so we do a second request with cors
        return fetch(`http://${ip}/`).catch(() => null);
      })
      .then(response => {
        if (response) {
          foundDevices.push({ ip, name: `ESP32 at ${ip}` });
        }
      })
      .catch(() => {
        // Ignore errors - this is expected for most IPs
      });
      
      promises.push(promise);
      
      // Process in batches of 10 to not overwhelm the browser
      if (promises.length >= 10) {
        await Promise.all(promises);
        promises.length = 0;
        
        // Update devices found so far
        if (foundDevices.length > 0) {
          setDevices([...foundDevices]);
        }
      }
    }
    
    // Process any remaining promises
    await Promise.all(promises);
    
    // Final update
    setDevices([...foundDevices]);
    setScanning(false);
    
    if (foundDevices.length > 0) {
      displayStatus(`Found ${foundDevices.length} potential LED controller(s)`, 'success');
    } else {
      displayStatus('No LED controllers found on your network', 'error');
    }
  };

  // Toggle voice recording
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      setTranscript('');
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        displayStatus('Speech recognition not supported in this browser', 'error');
      }
    }
  };

  // Text-to-speech function using Azure
  const speakResponse = async (text: string) => {
    if (!voiceEnabled) return;
    
    try {
      // This would call your Azure TTS service
      // For now, we'll use the browser's built-in TTS as a placeholder
      const speechSynthesis = window.speechSynthesis;
      if (speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
      }
      
      // Actual Azure TTS implementation would be something like:
      /*
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      });
      
      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
        }
      }
      */
    } catch (error) {
      console.error('Error with text-to-speech:', error);
    }
  };

  // Connect to the ESP32 via HTTP
  const connectToESP32 = async (ip?: string) => {
    const targetIp = ip || ipAddress;
    
    if (!targetIp) {
      displayStatus('Please enter an IP address', 'error');
      return;
    }

    try {
      displayStatus('Connecting to LED controller...', 'info');
      
      // Test connection with a ping request
      const response = await fetch(`http://${targetIp}/`);
      
      if (response.ok) {
        setIpAddress(targetIp);
        setConnected(true);
        displayStatus('Connected to LED controller!', 'success');
        speakResponse('Connected to LED controller');
        
        // Start periodic polling for updates
        if (polling) clearInterval(polling);
        
        const intervalId = setInterval(() => {
          fetchStatus(targetIp);
        }, 5000);
        
        setPolling(intervalId);
        
        // Get initial status
        fetchStatus(targetIp);
      } else {
        setConnected(false);
        displayStatus(`Connection failed: Server returned ${response.status}`, 'error');
      }
    } catch (error) {
      console.error('Connection error:', error);
      setConnected(false);
      displayStatus(`Failed to connect: ${(error as Error).message || 'Network error'}`, 'error');
    }
  };
  
  // Fetch current LED status
  const fetchStatus = async (ip?: string) => {
    const targetIp = ip || ipAddress;
    if (!targetIp || !connected) return;
    
    try {
      const response = await fetch(`http://${targetIp}/status`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Received status update:', data);
        
        // Update state with received values
        if (data.brightness !== undefined) setBrightness(data.brightness);
        if (data.color !== undefined) setColor(data.color);
        if (data.animation !== undefined) setAnimation(data.animation);
        if (data.speed !== undefined) setSpeed(data.speed);
      } else {
        console.error('Failed to fetch status:', response.status);
        if (response.status === 0 || response.status >= 500) {
          // Connection lost
          setConnected(false);
          displayStatus('Connection to LED controller lost', 'error');
          
          // Stop polling
          if (polling) {
            clearInterval(polling);
            setPolling(null);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching status:', error);
      setConnected(false);
      displayStatus('Connection lost. Please reconnect.', 'error');
      
      // Stop polling
      if (polling) {
        clearInterval(polling);
        setPolling(null);
      }
    }
  };

  // Send updates to ESP32
  const updateLEDs = async () => {
    if (!ipAddress || !connected) {
      displayStatus('Not connected to LED controller', 'error');
      return;
    }
    
    const data = {
      brightness,
      color,
      animation,
      speed
    };
    
    try {
      displayStatus('Updating LED settings...', 'info');
      
      const response = await fetch(`http://${ipAddress}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        displayStatus('LED settings updated successfully!', 'success');
      } else {
        displayStatus(`Failed to update: Server returned ${response.status}`, 'error');
      }
    } catch (error) {
      console.error('Error updating LED settings:', error);
      displayStatus(`Update failed: ${(error as Error).message || 'Network error'}`, 'error');
      setConnected(false);
    }
  };

  // Send AI command - now using our service
  const sendAICommand = async (command?: string) => {
    const inputCommand = command || aiCommand;
    
    if (!inputCommand.trim()) {
      displayStatus('Please enter a command', 'error');
      return;
    }
    
    setProcessing(true);
    displayStatus('Processing your request...', 'info');
    
    try {
      // Process the command using Azure OpenAI
      const result = await processLEDCommand(inputCommand);
      
      if (!result) {
        const errorMessage = 'Sorry, I couldn\'t process that command';
        displayStatus(errorMessage, 'error');
        speakResponse(errorMessage);
        setProcessing(false);
        return;
      }
      
      // Apply the returned settings
      const { action, value } = result;
      let responseMessage = '';
      
      if (action === 'color') {
        setColor(value);
        responseMessage = `Setting color to ${value}`;
        displayStatus(responseMessage, 'success');
      } 
      else if (action === 'brightness') {
        const newBrightness = parseInt(value);
        setBrightness(newBrightness);
        responseMessage = `Setting brightness to ${newBrightness}`;
        displayStatus(responseMessage, 'success');
      } 
      else if (action === 'animation') {
        const newAnimation = parseInt(value);
        setAnimation(newAnimation);
        responseMessage = `Setting animation to ${newAnimation === 0 ? 'off' : `mode ${newAnimation}`}`;
        displayStatus(responseMessage, 'success');
      } 
      else if (action === 'speed') {
        const newSpeed = parseInt(value);
        setSpeed(newSpeed);
        responseMessage = `Setting animation speed to ${newSpeed}`;
        displayStatus(responseMessage, 'success');
      }
      
      // Provide voice feedback
      speakResponse(responseMessage);
      
      // After updating local state, send to the device if connected
      if (connected) {
        updateLEDs();
      } else {
        displayStatus('Changes applied locally. Connect to device to update LEDs.', 'info');
      }
    } catch (error) {
      console.error('Error processing AI command:', error);
      const errorMessage = 'Error processing your request';
      displayStatus(errorMessage, 'error');
      speakResponse(errorMessage);
    } finally {
      setProcessing(false);
      if (!command) setAiCommand('');
    }
  };

  // Set preset color
  const setPresetColor = (presetColor: string) => {
    setColor(presetColor);
  };

  // Display status message
  const displayStatus = (message: string, _type: string) => {
    setStatus(message);
    setShowStatus(true);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setShowStatus(false);
    }, 5000);
  };

  // Clean up polling and speech recognition on component unmount
  useEffect(() => {
    return () => {
      if (polling) {
        clearInterval(polling);
      }
      
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
      
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [polling, isListening]);

  return (
    <div className="min-h-screen w-full bg-matthewDark text-matthewLight pt-16 pb-20">
      {/* Hidden audio element for TTS */}
      <audio ref={audioRef} className="hidden" />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-matthewPurple to-purple-900 text-white py-12 px-4 rounded-b-3xl shadow-lg mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fadeIn">
            Matthew AI
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Control your LED lights with AI voice commands and animations
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Connection Panel */}
        <div className="bg-matthewGray rounded-xl shadow-xl p-6 transform transition-all hover:scale-[1.01]">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Wifi className="w-6 h-6 text-matthewPurple" />
            <span>Device Connection</span>
            <div className="ml-auto">
              <button 
                onClick={scanForDevices} 
                className="flex items-center gap-1 text-sm bg-matthewPurple/20 hover:bg-matthewPurple/30 rounded-full px-3 py-1"
                disabled={scanning}
              >
                {scanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>{scanning ? 'Scanning...' : 'Scan Network'}</span>
              </button>
            </div>
          </h2>
          
          {devices.length > 0 && (
            <div className="mb-4 overflow-auto max-h-32 bg-matthewDark/50 rounded-lg p-2">
              <p className="text-xs text-matthewLight/70 mb-2">Found devices:</p>
              {devices.map((device, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-2 hover:bg-matthewPurple/20 rounded cursor-pointer"
                  onClick={() => connectToESP32(device.ip)}
                >
                  <span className="text-sm">{device.name}</span>
                  <button className="text-xs bg-matthewPurple/30 hover:bg-matthewPurple px-2 py-1 rounded">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-4 items-center">
            <input
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder="ESP32 IP Address (e.g. 192.168.1.100)"
              className="flex-1 px-4 py-2 bg-matthewDark border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-matthewPurple text-white"
            />
            <button
              onClick={() => connectToESP32()}
              className={`px-4 py-2 rounded-lg font-medium text-white transition-all ${
                connected ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20' : 'bg-matthewPurple hover:bg-purple-700 shadow-lg shadow-matthewPurple/20'
              }`}
            >
              {connected ? 'Connected' : 'Connect'}
            </button>
          </div>
          
          {showStatus && (
            <div 
              className={`mt-4 p-3 rounded-lg ${
                status.includes('error') ? 'bg-red-900/30 text-red-200 border-l-4 border-red-500' : 
                status.includes('success') ? 'bg-green-900/30 text-green-200 border-l-4 border-green-500' : 
                'bg-blue-900/30 text-blue-200 border-l-4 border-blue-500'
              } animate-fadeIn`}
            >
              {status}
            </div>
          )}
        </div>

        {/* Control Panel */}
        <div className="bg-matthewGray rounded-xl shadow-xl p-6 transform transition-all hover:scale-[1.01]">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Sliders className="w-6 h-6 text-matthewPurple" />
            LED Controls
          </h2>
          
          <div className="space-y-8">
            {/* Brightness Control */}
            <div>
              <label className="block text-lg font-medium mb-2 flex items-center">
                <span>Brightness: {brightness}</span>
                <div className="relative w-16 h-4 ml-2 bg-gradient-to-r from-gray-800 to-white rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent to-matthewPurple/50" 
                    style={{ width: `${(brightness / 255) * 100}%` }}
                  ></div>
                </div>
              </label>
              <input
                type="range"
                min="0"
                max="255"
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
                className="w-full h-2 bg-matthewDark rounded-lg appearance-none cursor-pointer slider-thumb-purple"
              />
            </div>
            
            {/* Color Control */}
            <div>
              <label className="block text-lg font-medium mb-2 flex items-center gap-2">
                <Palette className="w-5 h-5 text-matthewPurple" />
                Color
              </label>
              <div 
                className="w-full h-12 rounded-lg mb-2 overflow-hidden relative"
                style={{ 
                  background: `linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center bg-matthewDark/70">
                  <div className="h-8 w-8 rounded-full transition-all" style={{ backgroundColor: color }}></div>
                </div>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-full opacity-0 cursor-pointer absolute inset-0"
                />
              </div>
              
              <div className="grid grid-cols-7 gap-2 mt-2">
                <button
                  onClick={() => setPresetColor('#ff0000')}
                  className="h-8 bg-red-600 rounded-md shadow-sm transform transition-transform hover:scale-110 hover:shadow-lg hover:shadow-red-600/30"
                  aria-label="Red"
                />
                <button
                  onClick={() => setPresetColor('#00ff00')}
                  className="h-8 bg-green-500 rounded-md shadow-sm transform transition-transform hover:scale-110 hover:shadow-lg hover:shadow-green-500/30"
                  aria-label="Green"
                />
                <button
                  onClick={() => setPresetColor('#0000ff')}
                  className="h-8 bg-blue-600 rounded-md shadow-sm transform transition-transform hover:scale-110 hover:shadow-lg hover:shadow-blue-600/30"
                  aria-label="Blue"
                />
                <button
                  onClick={() => setPresetColor('#ffff00')}
                  className="h-8 bg-yellow-400 rounded-md shadow-sm transform transition-transform hover:scale-110 hover:shadow-lg hover:shadow-yellow-400/30"
                  aria-label="Yellow"
                />
                <button
                  onClick={() => setPresetColor('#ff00ff')}
                  className="h-8 bg-pink-500 rounded-md shadow-sm transform transition-transform hover:scale-110 hover:shadow-lg hover:shadow-pink-500/30"
                  aria-label="Pink"
                />
                <button
                  onClick={() => setPresetColor('#00ffff')}
                  className="h-8 bg-cyan-400 rounded-md shadow-sm transform transition-transform hover:scale-110 hover:shadow-lg hover:shadow-cyan-400/30"
                  aria-label="Cyan"
                />
                <button
                  onClick={() => setPresetColor('#ffffff')}
                  className="h-8 bg-white border border-gray-300 rounded-md shadow-sm transform transition-transform hover:scale-110 hover:shadow-lg hover:shadow-white/30"
                  aria-label="White"
                />
              </div>
            </div>
            
            {/* Animation Control */}
            <div>
              <label className="block text-lg font-medium mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-matthewPurple" />
                Animation
              </label>
              <select
                value={animation}
                onChange={(e) => setAnimation(parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-matthewDark border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-matthewPurple text-white appearance-none cursor-pointer"
                style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' stroke='%236419E6' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '16px'
                }}
              >
                <option value="0">Off (Solid Color)</option>
                <option value="1">Color Wipe</option>
                <option value="2">Rainbow</option>
                <option value="3">Theater Chase</option>
              </select>
            </div>
            
            {/* Animation Speed */}
            <div>
              <label className="block text-lg font-medium mb-2 flex items-center">
                <span>Animation Speed: {speed}</span>
                <div className="relative w-16 h-4 ml-2 bg-gradient-to-r from-gray-800 to-white rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent to-matthewPurple/50"
                    style={{ width: `${((speed - 5) / 195) * 100}%` }}
                  ></div>
                </div>
              </label>
              <input
                type="range"
                min="5"
                max="200"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full h-2 bg-matthewDark rounded-lg appearance-none cursor-pointer slider-thumb-purple"
              />
            </div>
            
            <button
              onClick={updateLEDs}
              disabled={!connected}
              className="w-full py-3 bg-matthewPurple hover:bg-purple-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-matthewPurple/20 hover:shadow-matthewPurple/40"
            >
              Update LEDs
            </button>
          </div>
        </div>

        {/* AI Control Panel */}
        <div className="bg-matthewGray rounded-xl shadow-xl p-6 transform transition-all hover:scale-[1.01]">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-matthewPurple" />
            <span>AI Voice/Text Control</span>
            <div className="ml-auto">
              <button 
                onClick={() => setShowSettings(!showSettings)} 
                className="text-matthewLight/70 hover:text-matthewLight"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </h2>
          
          {showSettings && (
            <div className="mb-4 p-3 bg-matthewDark/50 rounded-lg animate-fadeIn">
              <h3 className="text-sm font-medium mb-2">Settings</h3>
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={voiceEnabled}
                    onChange={() => setVoiceEnabled(!voiceEnabled)}
                    className="sr-only"
                  />
                  <div className={`relative w-10 h-5 transition-colors duration-200 ease-linear rounded-full ${voiceEnabled ? 'bg-matthewPurple' : 'bg-gray-600'}`}>
                    <div className={`absolute left-0.5 top-0.5 w-4 h-4 transition-transform duration-200 ease-linear transform bg-white rounded-full ${voiceEnabled ? 'translate-x-5' : ''}`}></div>
                  </div>
                  <span className="ml-2 text-sm">Voice Feedback</span>
                </label>
                <Volume2 className={`ml-2 w-4 h-4 ${voiceEnabled ? 'text-matthewPurple' : 'text-gray-600'}`} />
              </div>
            </div>
          )}
          
          <p className="text-matthewLight/80 mb-4">
            Tell the AI what lighting effect you want using natural language
          </p>
          
          <div className="flex flex-col gap-2">
            {isListening && (
              <div className="bg-matthewPurple/20 p-3 rounded-lg mb-2 animate-pulse">
                <p className="text-sm">Listening... "{transcript}"</p>
              </div>
            )}
            
            <div className="flex gap-2">
              <input
                type="text"
                value={aiCommand}
                onChange={(e) => setAiCommand(e.target.value)}
                placeholder="e.g., 'Make the lights blue' or 'Start a rainbow effect'"
                className="flex-1 px-4 py-2 bg-matthewDark border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-matthewPurple text-white"
                onKeyPress={(e) => e.key === 'Enter' && !processing && sendAICommand()}
              />
              <button
                onClick={toggleListening}
                className={`px-3 rounded-lg text-white ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <button
                onClick={() => sendAICommand()}
                disabled={processing || (!aiCommand.trim() && !isListening)}
                className="px-4 py-2 bg-matthewPurple hover:bg-purple-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-matthewPurple/20 hover:shadow-matthewPurple/40"
              >
                {processing ? 'Processing...' : 'Send'}
             </button>
           </div>
           
           <div className="mt-4 text-sm text-matthewLight/70 bg-matthewDark/30 p-3 rounded-lg">
             <p className="font-medium mb-2">Example commands:</p>
             <div className="grid grid-cols-2 gap-2">
               <div className="bg-matthewDark/40 p-2 rounded hover:bg-matthewDark/60 cursor-pointer transition-all" onClick={() => setAiCommand('Turn the lights red')}>
                 Turn the lights red
               </div>
               <div className="bg-matthewDark/40 p-2 rounded hover:bg-matthewDark/60 cursor-pointer transition-all" onClick={() => setAiCommand('Start rainbow animation')}>
                 Start rainbow animation
               </div>
               <div className="bg-matthewDark/40 p-2 rounded hover:bg-matthewDark/60 cursor-pointer transition-all" onClick={() => setAiCommand('Set brightness to maximum')}>
                 Set brightness to maximum
               </div>
               <div className="bg-matthewDark/40 p-2 rounded hover:bg-matthewDark/60 cursor-pointer transition-all" onClick={() => setAiCommand('Make the lights dim and blue')}>
                 Make the lights dim and blue
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
};

export default Home;