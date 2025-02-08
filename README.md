
# Maja Reporting Tool
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
