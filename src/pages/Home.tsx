import { Link } from 'react-router-dom';
import { Shield, Heart, MessageCircle, Lock } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <div className="relative overflow-hidden curve-border">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/brandImage.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-1 hero-gradient" />

        {/* Content Container */}
        <div className="relative z-10 h-[100vh] flex flex-col justify-center items-center text-center px-4">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-white text-5xl md:text-7xl font-bold mb-6 text-shadow">
              Report Racism Safely
            </h1>
            <p className="text-white/90 text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              Your voice matters. Report incidents of racism anonymously and help us create change.
            </p>
            <Link
              to="/report"
              className="inline-flex items-center px-8 py-4 rounded-full bg-[#6419E6] text-white text-lg font-medium hover:bg-[#5414C4] transition-all transform hover:scale-105"
            >
              Make a Report
            </Link>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How Maja Helps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Heart className="w-16 h-16 text-[#6419E6]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Maja Listens</h3>
              <p className="text-gray-600">
                Without judgment, Maja provides a safe space for your voice to be heard.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Shield className="w-16 h-16 text-[#6419E6]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Maja Protects</h3>
              <p className="text-gray-600">
                Your privacy and security are our top priorities.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <MessageCircle className="w-16 h-16 text-[#6419E6]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Maja Cares</h3>
              <p className="text-gray-600">
                Take your time, share at your own pace. Your wellbeing comes first.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Lock className="w-16 h-16 text-[#6419E6]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Maja Supports</h3>
              <p className="text-gray-600">
                Access resources and support services when you need them.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlight */}
      <div className="bg-gray-50 py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="flex-1 animate-fade-in">
              <h2 className="text-4xl font-bold mb-6">Voice-Enabled Reporting</h2>
              <div className="space-y-6">
                <p className="text-xl text-gray-600">
                  Report incidents naturally through conversation with our AI assistant.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#6419E6]" />
                    <span>Speak freely without judgment</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#6419E6]" />
                    <span>Take breaks whenever you need</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#6419E6]" />
                    <span>Complete privacy and anonymity</span>
                  </li>
                </ul>
                <Link 
                  to="/report" 
                  className="inline-flex items-center text-[#6419E6] font-medium hover:underline mt-4"
                >
                  Start your report →
                </Link>
              </div>
            </div>
            <div className="flex-1 lg:block">
              <div className="bg-white p-8 rounded-3xl shadow-lg transform rotate-2 transition-transform hover:rotate-0">
                <img 
                  src="/brandImage.jpg" 
                  alt="Reporting Interface" 
                  className="rounded-2xl shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;