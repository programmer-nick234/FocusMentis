import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="nav-responsive container mx-auto px-4 py-6 border-b border-gray-800">
        <div className="text-3xl font-bold gradient-text flex items-center gap-3">
          <span className="text-4xl">🎧</span>
          FocusMentex
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="btn btn-primary hover-lift animate-fade-in"
          >
            Start Converting
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-6">
            Transform Your Audio into
            <span className="block gradient-text-secondary mt-2">
              Multiple Styles
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Upload any audio file (up to 4 minutes) and instantly convert it into Lo-fi, Phonk, Melody, and 8D audio styles.
            Perfect for content creators, musicians, and audio enthusiasts.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link
              href="/dashboard"
              className="btn btn-primary text-lg px-8 py-4 hover-lift hover-glow"
            >
              Start Converting Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid-responsive">
          <div className="card hover-lift animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="text-5xl mb-4">🎵</div>
            <h3 className="text-xl font-semibold text-white mb-3">Lo-fi Style</h3>
            <p className="text-gray-400 leading-relaxed">
              Relaxing, chill vibes perfect for study sessions and relaxation. 
              Smooth, atmospheric sounds that help you focus and unwind.
            </p>
          </div>

          <div className="card hover-lift animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-5xl mb-4">🔥</div>
            <h3 className="text-xl font-semibold text-white mb-3">Phonk Style</h3>
            <p className="text-gray-400 leading-relaxed">
              High-energy, bass-heavy style with modern electronic elements. 
              Perfect for workouts, gaming, and high-intensity activities.
            </p>
          </div>

          <div className="card hover-lift animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="text-5xl mb-4">🎶</div>
            <h3 className="text-xl font-semibold text-white mb-3">Melody Style</h3>
            <p className="text-gray-400 leading-relaxed">
              Enhanced melodic elements with clear, crisp audio quality. 
              Brings out the best in vocal tracks and instrumental pieces.
            </p>
          </div>

          <div className="card hover-lift animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-5xl mb-4">🌊</div>
            <h3 className="text-xl font-semibold text-white mb-3">8D Audio</h3>
            <p className="text-gray-400 leading-relaxed">
              Immersive 3D audio experience with spatial sound effects. 
              Feel the music move around you in a 360-degree soundscape.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-center text-4xl font-bold text-white mb-16 gradient-text">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 hover-lift">
              1
            </div>
            <h3 className="text-white font-semibold mb-3 text-xl">Upload Audio</h3>
            <p className="text-gray-400 leading-relaxed">
              Simply drag and drop or select any audio file up to 4 minutes. 
              We support MP3, WAV, M4A, and FLAC formats.
            </p>
          </div>

          <div className="text-center animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 hover-lift">
              2
            </div>
            <h3 className="text-white font-semibold mb-3 text-xl">Choose Style</h3>
            <p className="text-gray-400 leading-relaxed">
              Select from our four premium styles: Lo-fi, Phonk, Melody, or 8D. 
              You can choose multiple styles at once.
            </p>
          </div>

          <div className="text-center animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 hover-lift">
              3
            </div>
            <h3 className="text-white font-semibold mb-3 text-xl">Download</h3>
            <p className="text-gray-400 leading-relaxed">
              Get your transformed audio instantly. High-quality output ready 
              for your projects, content, or personal enjoyment.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-center text-4xl font-bold text-white mb-16 gradient-text">
          Why Choose FocusMentex?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="text-5xl mb-6">⚡</div>
            <h3 className="text-white font-semibold mb-3 text-xl">Instant Processing</h3>
            <p className="text-gray-400 leading-relaxed">
              Advanced AI-powered processing ensures your audio is transformed 
              in seconds, not minutes.
            </p>
          </div>

          <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-5xl mb-6">🔒</div>
            <h3 className="text-white font-semibold mb-3 text-xl">No Registration</h3>
            <p className="text-gray-400 leading-relaxed">
              Start converting immediately, no signup required. 
              Your privacy and convenience come first.
            </p>
          </div>

          <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="text-5xl mb-6">💎</div>
            <h3 className="text-white font-semibold mb-3 text-xl">High Quality</h3>
            <p className="text-gray-400 leading-relaxed">
              Professional-grade audio transformation with studio-quality output. 
              Perfect for commercial and personal use.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="glass p-12 rounded-2xl text-center max-w-3xl mx-auto animate-scale-in">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Audio?
          </h2>
          <p className="text-gray-300 mb-8 text-lg leading-relaxed">
            Join thousands of creators who trust FocusMentex for their audio transformation needs.
          </p>
          <Link
            href="/dashboard"
            className="btn btn-secondary text-lg px-8 py-4 hover-lift hover-glow"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <div className="text-2xl font-bold gradient-text mb-2">🎧 FocusMentex</div>
            <p className="text-gray-400">
              Transform your audio, enhance your content.
            </p>
          </div>
          <div className="text-sm text-gray-500 space-y-2">
            <p>Free online audio converter for Lo-fi, Phonk, Melody, and 8D audio styles.</p>
            <p>&copy; 2024 FocusMentex. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
