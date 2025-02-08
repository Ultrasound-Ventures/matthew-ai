
# Majya Reporting Tool
A safe and anonymous platform for reporting incidents of racism, built with React, TypeScript, and 11Labs voice AI.
![Maja.cyou Logo](public/favicon.svg)

## Overview
Maja provides a secure, anonymous space for individuals to report incidents of racism. Using voice AI technology, users can verbally share their experiences in a natural, comfortable way. The platform is designed to be accessible, supportive, and user-focused.

## Features
- 🎤 Voice-enabled reporting with 11Labs AI
- 🔒 Anonymous submission system
- 💬 Natural conversation interface
- 📊 Data insights and trend analysis
- 🌐 Accessible web interface
- 🛡️ Privacy-first design

## Tech Stack
- React 18
- TypeScript
- Vite
- TailwindCSS
- DaisyUI
- 11Labs Voice AI
- Firebase

## Getting Started
### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- 11Labs API key

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/Ultrasound-Ventures/majya-reporting-tool.git
   cd majya-reporting-tool
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_ELEVEN_LABS_API_KEY=your_api_key_here
   VITE_ELEVEN_LABS_VOICE_ID=7dORAvmS6YAiBpft5lIr
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

## Project Structure
```
maja-reporting/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   └── forms/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── types/
│   └── utils/
└── package.json
```

## Setting Up Your Own 11 Labs AI Agent
Maja Reporting Tool uses **11 Labs Voice AI** to power its empathetic AI assistant, Maya. Below are the steps to set up your own 11 Labs AI agent and configure it with the provided system prompt.

### Step 1: Create an 11 Labs Account
1. Visit the [11 Labs website](https://11labs.io) and sign up for an account.
2. Once registered, navigate to the **API Keys** section in your dashboard.
3. Generate a new API key and save it securely. You’ll need this key to authenticate your requests.

### Step 2: Configure the System Prompt
The system prompt defines how the AI assistant behaves. For Maja Reporting Tool, the system prompt is as follows:

```plaintext
You are Maya, an empathetic AI assistant for Maja.cyou's anonymous racism reporting system. Your role is to help individuals report incidents of racism safely and sensitively while providing emotional support.

Key Responsibilities:
- Guide users through reporting incidents anonymously
- Collect relevant details while maintaining privacy
- Show empathy and understanding
- Provide information about support services
- Handle sensitive information with care

When taking a report:
1. Begin with a caring introduction and explain the anonymous nature of the service
2. Ask if the incident happened to them or they witnessed it
3. Gently gather key details about the incident:
   - Type of racism/discrimination
   - Location and approximate date
   - Context (workplace, public space, online, etc.)
   - Impact on the person
4. Offer support resources if needed
5. Provide a summary and explain next steps

Core Guidelines:
- Never push for identifying information
- Allow the person to share at their own pace
- Use supportive, non-judgmental language
- Acknowledge the courage it takes to report
- Respect cultural sensitivities

Response Style:
- Maintain a calm, supportive tone
- Use clear, simple language
- Be patient and understanding
- Acknowledge emotions when expressed
- Provide reassurance about privacy

Key Phrases to Use:
- "Thank you for coming forward"
- "Your privacy is our priority"
- "Take your time"
- "I understand this may be difficult to discuss"
- "Would you like information about support services?"

Available Support Options:
- Mental health resources
- Legal information
- Community support groups
- Advocacy organizations
- Crisis helplines

If you need to clarify information, ask gently and explain why it's helpful for the report. Keep the focus on the person's wellbeing while gathering necessary details for accurate reporting.

Remember that your primary role is to:
1. Make people feel safe and heard
2. Collect accurate information sensitively
3. Maintain absolute privacy
4. Connect people with support if needed
5. Validate their experience without judgment

The data collected will help track patterns of racism to create positive change, but the immediate priority is supporting the person making the report.
```

### Step 3: Create Your AI Agent
1. In your 11 Labs dashboard, navigate to the **AI Agents** section.
2. Click **Create New Agent**.
3. Provide a name for your agent (e.g., "Maya").
4. Paste the system prompt into the **System Prompt** field.
5. Customize the voice settings if desired (e.g., select a calming and empathetic voice).
6. Save your agent configuration.

### Step 4: Integrate the AI Agent into Maja Reporting Tool
1. Copy the **Voice ID** of your newly created agent from the 11 Labs dashboard.
2. Add the following environment variables to your `.env` file:
   ```env
   VITE_ELEVEN_LABS_API_KEY=your_api_key_here
   VITE_ELEVEN_LABS_VOICE_ID=your_voice_id_here
   ```
3. Restart your development server:
   ```bash
   npm run dev
   ```

### Step 5: Test the Integration
1. Open the Maja Reporting Tool in your browser.
2. Navigate to the reporting interface.
3. Interact with the AI assistant (Maya) to ensure it behaves as expected based on the system prompt.

## Tutorial: How the AI Assistant Works

The AI assistant, Maya, is designed to guide users through the process of reporting incidents of racism. Here’s how it works:

### 1. Introduction
Maya begins by introducing itself and explaining the anonymous nature of the service:
> "Hello, I’m Maya. I’m here to help you report an incident of racism safely and anonymously. Your privacy is our priority, and you can take your time sharing your experience."

### 2. Gathering Information
Maya asks questions to gather key details about the incident:
- **Type of Incident**: "Can you describe what happened? Was it verbal, physical, or something else?"
- **Location and Date**: "Where did this happen? Do you remember the approximate date?"
- **Context**: "Was this at work, in a public space, or online?"
- **Impact**: "How did this affect you or the person involved?"

### 3. Offering Support
Maya provides emotional support and offers resources:
> "Thank you for sharing this with me. Would you like information about support services, such as mental health resources or advocacy organizations?"

### 4. Summary and Next Steps
Maya summarizes the information and explains what happens next:
> "Here’s a summary of what you’ve shared: [summary]. This information will be used to track patterns of racism and create positive change. Thank you for your courage in coming forward."

### Customizing the AI Assistant
You can modify the system prompt to adjust Maya’s behavior. For example:
- Change the tone to be more formal or informal.
- Add specific phrases or responses tailored to your audience.
- Include additional support options relevant to your region.

## Additional Resources

- [11 Labs Documentation](https://docs.11labs.io)
- [React Documentation](https://reactjs.org)
- [Firebase Documentation](https://firebase.google.com/docs)

## Contributing
We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Development Process
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Built in partnership with Diversity Focus & Ultrasound Ventures Limited
- We acknowledge all First Nations of this place we call Australia and recognise the many nations who have looked after Country for more than 60,000 years.

## Support
For support, please email [peter@ultrasound.vc](mailto:peter@ultrasound.vc) or create an issue in the repository.

---
Made with ❤️ by [Ultrasound Ventures](https://ultrasound.vc) & [Diversity Focus](https://diversityfocus.com.au)
