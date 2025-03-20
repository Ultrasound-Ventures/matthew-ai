// src/services/ledControlAI.ts

// Azure OpenAI credentials from environment variables
const AZURE_OPENAI_ENDPOINT = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
const AZURE_OPENAI_API_KEY = import.meta.env.VITE_AZURE_OPENAI_API_KEY;
const AZURE_OPENAI_API_VERSION = import.meta.env.VITE_AZURE_OPENAI_API_VERSION;
const LED_SYSTEM_PROMPT = import.meta.env.VITE_LED_SYSTEM_PROMPT;

/**
 * Process a user's natural language command for LED control
 * @param command The user's command text
 * @returns Parsed LED control settings in JSON format, or null if processing failed
 */
export const processLEDCommand = async (command: string): Promise<{
  action: 'color' | 'animation' | 'brightness' | 'speed';
  value: string;
} | null> => {
  try {
    console.log("Processing LED command:", command);
    
    const response = await fetch(`${AZURE_OPENAI_ENDPOINT}/openai/deployments/gpt-4o/chat/completions?api-version=${AZURE_OPENAI_API_VERSION}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': AZURE_OPENAI_API_KEY
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: LED_SYSTEM_PROMPT
          },
          {
            role: "user",
            content: command
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });
    
    if (!response.ok) {
      console.error(`Error processing command: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Error details: ${errorText}`);
      return null;
    }
    
    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI Response:', aiResponse);
    
    try {
      // Parse the JSON response from the AI
      const actionData = JSON.parse(aiResponse);
      
      // Validate the response format
      if (!actionData.action || !actionData.value) {
        console.error('Invalid response format from AI');
        return null;
      }
      
      // Validate the action type
      const validActions = ['color', 'animation', 'brightness', 'speed'];
      if (!validActions.includes(actionData.action)) {
        console.error(`Invalid action type: ${actionData.action}`);
        return null;
      }
      
      return {
        action: actionData.action as 'color' | 'animation' | 'brightness' | 'speed',
        value: actionData.value
      };
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      return null;
    }
  } catch (error) {
    console.error('Error processing LED command:', error);
    return null;
  }
};

/**
 * Utility function to convert a number to a hex color
 * @param r Red value (0-255)
 * @param g Green value (0-255)
 * @param b Blue value (0-255)
 * @returns Hex color string with # prefix
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

/**
 * Utility function to convert hex color to RGB
 * @param hex Hex color string (with or without # prefix)
 * @returns Object containing r, g, b values
 */
export const hexToRgb = (hex: string): { r: number, g: number, b: number } | null => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};