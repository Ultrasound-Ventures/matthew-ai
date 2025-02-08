import { useState, useEffect } from 'react';
import { useConversation } from '@11labs/react';
import { Mic, Check } from 'lucide-react';

interface ConversationMessage {
  message: string;
  source: string;
}

interface TranscriptMessage {
  text: string;
  source: 'user' | 'agent';
  timestamp: number;
}

const Report = () => {
  const [isListening, setIsListening] = useState(false);
  const [showConsentMessage, setShowConsentMessage] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [error, setError] = useState('');

  const debugLog = (type: string, message: unknown): void => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${type}]`, message);
  };

  const conversation = useConversation({
    onConnect: () => {
      debugLog('Agent', 'Connected and listening');
      setIsListening(true);
      setError('');
      setTranscript(prev => [...prev, {
        text: "I'm here to help you report an incident safely and anonymously. Would you like to tell me what happened?",
        source: 'agent',
        timestamp: Date.now()
      }]);
    },
    onDisconnect: () => {
      debugLog('Agent', 'Disconnected');
      setIsListening(false);
    },
    onMessage: (message: ConversationMessage) => {
      debugLog('Message', {
        content: message.message,
        source: message.source
      });

      setTranscript(prev => [...prev, {
        text: message.message,
        source: message.source === 'human' ? 'user' : 'agent',
        timestamp: Date.now()
      }]);
    },
    onError: (message: string) => {
      debugLog('Error', message);
      setIsListening(false);
      setError("Sorry, I encountered an error. Please try again.");
    }
  });

  const handleMicClick = async () => {
    debugLog('Action', isListening ? 'Stopping conversation' : 'Starting conversation');
    
    if (attempts >= 2) {
      setError('You have reached the maximum number of attempts. Please sign in to continue.');
      return;
    }
    
    try {
      if (isListening) {
        await conversation.endSession();
      } else {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        await conversation.startSession({
          agentId: '7dORAvmS6YAiBpft5lIr'
        });
        setAttempts(prev => prev + 1);
      }
    } catch (err) {
      debugLog('Error', err);
      setError("Could not access microphone. Please check permissions.");
    }
  };

  useEffect(() => {
    const conversationContainer = document.querySelector('.conversation-container');
    if (conversationContainer) {
      conversationContainer.scrollTop = conversationContainer.scrollHeight;
    }
  }, [transcript]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Majya's Room</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A safe space for sharing your experience
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6 mb-12">
          <div className="flex items-start space-x-4">
            <div className="flex-1">
              <p className="text-gray-600">
                Your recording will only be used for training and quality purposes. You have complete control - you can choose to save your recording or delete it altogether. Your privacy and comfort are our top priorities.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Consent Message */}
        {showConsentMessage && (
          <div className="mb-8">
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-2">Privacy Notice</h3>
              <p className="text-gray-600 mb-6">
                This report is anonymous. Your personal data will not be shared without your consent. 
                We use fake names in reports and only share general trends.
              </p>
              <button
                onClick={() => setShowConsentMessage(false)}
                className="inline-flex items-center px-4 py-2 bg-[#6419E6] text-white rounded-full hover:bg-[#5414C4] transition-colors"
              >
                <Check className="w-4 h-4 mr-2" />
                I understand
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reporting Interface */}
          <div>
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold">Report an Incident</h2>
                <button 
                  onClick={handleMicClick}
                  disabled={attempts >= 2}
                  className={`p-4 rounded-full transition-all ${
                    isListening 
                      ? 'bg-[#6419E6] text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Mic className={isListening ? "animate-pulse w-6 h-6" : "w-6 h-6"} />
                </button>
              </div>

              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  {isListening 
                    ? "I'm listening... Please tell me about the incident."
                    : "Click the microphone to start your report"}
                </p>
              </div>
            </div>
          </div>

          {/* Conversation Panel */}
          <div>
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-6">Conversation</h2>
              <div className="conversation-container space-y-4 max-h-[500px] overflow-y-auto">
                {transcript.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.source === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${
                      message.source === 'user' 
                        ? 'bg-[#6419E6] text-white' 
                        : 'bg-gray-100'
                    } rounded-2xl px-4 py-3`}
                    >
                      <div className="text-xs opacity-70 mb-1">
                        {message.source === 'user' ? 'You' : 'Assistant'} • {
                          new Date(message.timestamp).toLocaleTimeString()
                        }
                      </div>
                      <div>
                        {message.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;