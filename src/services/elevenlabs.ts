const ELEVEN_LABS_API_KEY = import.meta.env.VITE_ELEVEN_LABS_API_KEY;
const VOICE_ID = import.meta.env.VITE_ELEVEN_LABS_VOICE_ID;
const API_URL = 'https://api.elevenlabs.io/v1';

export const textToSpeech = async (text: string): Promise<ArrayBuffer> => {
  try {
    const response = await fetch(
      `${API_URL}/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVEN_LABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to convert text to speech');
    }

    return await response.arrayBuffer();
  } catch (error) {
    console.error('Error in text-to-speech conversion:', error);
    throw error;
  }
};

export const createVoiceResponse = async (text: string): Promise<string> => {
  try {
    const audioData = await textToSpeech(text);
    const blob = new Blob([audioData], { type: 'audio/mpeg' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error creating voice response:', error);
    throw error;
  }
};