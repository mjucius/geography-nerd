import { AdSense } from '../components/AdSense';

interface HomeProps {
  onStartQuiz: () => void;
}

export function Home({ onStartQuiz }: HomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20 sm:py-32">
        <div className="text-center mb-20">
          <h1 className="text-5xl sm:text-7xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Geography Nerd
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Test your geographic knowledge by comparing city locations across the globe
          </p>

          <button
            onClick={onStartQuiz}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold text-lg py-4 px-12 rounded-full transition-all duration-300 hover:shadow-2xl hover:scale-105 inline-block transform"
          >
            Start Quiz 🚀
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-teal-500">
            <div className="text-5xl mb-4">📍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">10 Questions</h3>
            <p className="text-gray-600 leading-relaxed">Each quiz presents 10 unique geography challenges from cities worldwide</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-cyan-500">
            <div className="text-5xl mb-4">✓</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant Feedback</h3>
            <p className="text-gray-600 leading-relaxed">Get detailed distance calculations and immediate results for every answer</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-blue-500">
            <div className="text-5xl mb-4">🌐</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Global Coverage</h3>
            <p className="text-gray-600 leading-relaxed">Questions span major cities from every continent on Earth</p>
          </div>
        </div>

        {/* Ad Space */}
        <div className="mt-12">
          <AdSense slot="9876543210" format="auto" responsive={true} />
        </div>

        {/* How It Works */}
        <div className="mt-20 bg-gradient-to-br from-white to-cyan-50 rounded-2xl p-12 shadow-xl border border-cyan-100">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">1</div>
              <h4 className="font-semibold text-gray-900 mb-2">Read Question</h4>
              <p className="text-sm text-gray-600">See two cities and determine their directional relationship</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">2</div>
              <h4 className="font-semibold text-gray-900 mb-2">Choose Direction</h4>
              <p className="text-sm text-gray-600">Select North, South, East, or West</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">3</div>
              <h4 className="font-semibold text-gray-900 mb-2">Get Feedback</h4>
              <p className="text-sm text-gray-600">See the exact distance in degrees, km, and miles</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">4</div>
              <h4 className="font-semibold text-gray-900 mb-2">View Results</h4>
              <p className="text-sm text-gray-600">Complete all 10 questions and see your final score</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
