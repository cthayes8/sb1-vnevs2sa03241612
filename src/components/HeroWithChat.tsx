import { motion } from 'framer-motion';
import { Bot, ArrowRight, Sparkles } from 'lucide-react';
import { useWaitlistStore } from '../store/waitlistStore';

export function HeroWithChat() {
  const { openModal } = useWaitlistStore();

  return (
    <div className="relative isolate overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-purple-100 to-cyan-100 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 sm:pt-40 lg:px-8 lg:pt-44">
        <div className="gap-16 lg:grid lg:grid-cols-2 lg:gap-24">
          {/* Left column - Hero content */}
          <motion.div 
            className="mx-auto max-w-2xl lg:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8 flex items-center gap-x-2">
              <div className="rounded-full bg-purple-50 px-3 py-1 text-sm font-semibold leading-6 text-purple-600 ring-1 ring-inset ring-purple-600/10">
                Beta Coming Soon
              </div>
              <div className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-semibold leading-6 text-cyan-600 ring-1 ring-inset ring-cyan-600/10">
                Enterprise Ready
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              AI-Powered Telecom Sales Platform
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Transform your telecom sales with our enterprise-grade AI platform. Automate workflows, get intelligent recommendations, and close deals faster.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <button
                onClick={() => openModal('hero_section')}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200"></div>
                <div className="relative px-8 py-3 bg-white rounded-lg leading-none flex items-center divide-x divide-gray-200">
                  <span className="pr-3 text-purple-600 group-hover:text-purple-700 font-semibold transition duration-200">Request Beta Access</span>
                  <ArrowRight className="w-5 h-5 ml-3 text-cyan-600 group-hover:text-cyan-700 transition duration-200" />
                </div>
              </button>
              <a href="#demo" className="text-sm font-semibold leading-6 text-gray-900 hover:text-purple-600 transition-colors duration-200">
                Try Demo <span aria-hidden="true">→</span>
              </a>
            </div>
          </motion.div>

          {/* Right column - Chat demo */}
          <motion.div
            className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-full max-w-xl lg:max-w-lg">
              <div className="relative bg-white shadow-2xl rounded-2xl">
                {/* Chat header */}
                <div className="bg-gradient-to-r from-purple-600 to-cyan-600 rounded-t-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-6 w-6 text-white" />
                      <span className="text-white font-medium">AI Sales Assistant</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-white/20 px-2 py-1 rounded-full">
                      <span className="h-2 w-2 bg-green-400 rounded-full"></span>
                      <span className="text-xs text-white">Online</span>
                    </div>
                  </div>
                </div>

                {/* Chat content */}
                <div className="h-[28rem] overflow-y-auto p-4 space-y-4">
                  {/* Chat messages would go here */}
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <Bot className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 max-w-md">
                      <p className="text-gray-700">Hello! I'm your AI sales assistant. I can help you with product recommendations, pricing, and technical specifications for telecom solutions. What would you like to know?</p>
                    </div>
                  </div>
                </div>

                {/* Chat input */}
                <div className="border-t border-gray-100 p-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1 min-w-0 rounded-lg border border-gray-200 px-4 py-2.5 text-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                    />
                    <button className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 px-4 py-2.5 text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                      <Sparkles className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 