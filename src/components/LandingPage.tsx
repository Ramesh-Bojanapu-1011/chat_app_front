import React from "react";
import { MessageCircle, Users, Shield, Zap, ArrowRight } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">
              ChatApp
            </span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600">
              Features
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600">
              Pricing
            </a>
            <a href="#about" className="text-gray-600 hover:text-blue-600">
              About
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/login">
              <button className="px-4 py-2 text-blue-600 hover:text-blue-700">
                Login
              </button>
            </a>
            <a href="/signup">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Sign Up
              </button>
            </a>{" "}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
          Connect with anyone, <span className="text-blue-600">anywhere</span>
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Experience seamless communication with our modern chat platform.
          Connect with friends, family, and colleagues in real-time.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center">
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
          <button className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:border-blue-600 hover:text-blue-600">
            See How It Works
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose ChatApp?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Users className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Make Friends</h3>
            <p className="text-gray-600">
              Create groups for teams, friends, or communities. Share messages,
              files, and more.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Shield className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Messaging</h3>
            <p className="text-gray-600">
              End-to-end encryption ensures your conversations stay private and
              secure.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Zap className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Real-time messaging with instant delivery and seamless
              synchronization.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to start chatting?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join millions of users already connecting on ChatApp
          </p>
          <a href="/signup">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100">
              Create Free Account
            </button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <MessageCircle className="h-6 w-6 text-blue-600" />
            <span className="ml-2 text-gray-800">ChatApp</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-blue-600">
              Privacy
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              Terms
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
