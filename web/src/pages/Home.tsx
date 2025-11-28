import { AdSense } from '../components/AdSense';

interface HomeProps {
  onStartQuiz: () => void;
}

export function Home({ onStartQuiz }: HomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-teal-700 to-cyan-600">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-8">
          {/* Large Logo as Character */}
          <div className="mb-8 flex justify-center">
            <img
              src="/GeographyNerd-Logo_200.png"
              alt="Geography Nerd Character"
              className="h-48 w-48 drop-shadow-2xl"
            />
          </div>

          <p className="text-lg sm:text-xl text-yellow-50 mb-8 max-w-3xl mx-auto leading-relaxed">
            Test your geographic knowledge by comparing city locations across the globe
          </p>

          <button
            onClick={onStartQuiz}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-lg py-4 px-12 rounded-full transition-all duration-300 hover:shadow-2xl hover:scale-105 inline-block transform"
          >
            Start Quiz 🚀
          </button>
        </div>

        {/* How It Works */}
        <div className="mt-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-xl border border-teal-500">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-100 to-yellow-50 bg-clip-text text-transparent mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">1</div>
              <h4 className="font-semibold text-yellow-50 mb-2">Read Question</h4>
              <p className="text-sm text-yellow-100">See two cities and determine their directional relationship</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">2</div>
              <h4 className="font-semibold text-yellow-50 mb-2">Choose Direction</h4>
              <p className="text-sm text-yellow-100">Select North, South, East, or West</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">3</div>
              <h4 className="font-semibold text-yellow-50 mb-2">Get Feedback</h4>
              <p className="text-sm text-yellow-100">See the exact distance in degrees, km, and miles</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">4</div>
              <h4 className="font-semibold text-yellow-50 mb-2">View Results</h4>
              <p className="text-sm text-yellow-100">Complete all 10 questions and see your final score</p>
            </div>
          </div>
        </div>

        {/* Ad Space */}
        <div className="mt-6">
          <AdSense slot="9876543210" format="auto" responsive={true} />
        </div>
      </div>
    </div>
  );
}
