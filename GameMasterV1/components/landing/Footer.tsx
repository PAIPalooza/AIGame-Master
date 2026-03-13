import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1a0f2e] border-t border-brand-cyan/10 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-pink to-brand-cyan rounded" />
                <span className="font-heading text-xl font-bold text-white">AI Game Master</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Build living game worlds with AI-native narrative infrastructure.
              </p>
              <p className="text-gray-500 text-xs">
                Powered by ZeroDB + AIKit
              </p>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-400 hover:text-brand-cyan text-sm transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-400 hover:text-brand-cyan text-sm transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-brand-cyan text-sm transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-brand-cyan text-sm transition-colors">
                    API Reference
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-brand-cyan text-sm transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-brand-cyan text-sm transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-brand-cyan text-sm transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-brand-cyan text-sm transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-brand-cyan/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 AINative Studio. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-9 h-9 bg-brand-cyan/10 hover:bg-brand-cyan/20 rounded-full flex items-center justify-center transition-colors group"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4 text-brand-cyan" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-brand-cyan/10 hover:bg-brand-cyan/20 rounded-full flex items-center justify-center transition-colors group"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4 text-brand-cyan" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-brand-cyan/10 hover:bg-brand-cyan/20 rounded-full flex items-center justify-center transition-colors group"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-brand-cyan" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-brand-cyan/10 hover:bg-brand-cyan/20 rounded-full flex items-center justify-center transition-colors group"
                aria-label="Email"
              >
                <Mail className="w-4 h-4 text-brand-cyan" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
