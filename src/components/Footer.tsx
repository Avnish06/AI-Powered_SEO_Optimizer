"use client";

import { Mail, Phone, MapPin, ArrowUp } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1f2844] text-gray-300 font-sans border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* Top Contact Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Write to us */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Write To Us</p>
              <a href="mailto:support@hatbaliya.in" className="text-sm font-medium text-white hover:text-blue-400 transition-colors">support@hatbaliya.in</a>
            </div>
          </div>
          
          {/* Call us */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Call Us</p>
              <a href="tel:+918191800858" className="text-sm font-medium text-white hover:text-blue-400 transition-colors">+(91) 819 18 00858</a>
            </div>
          </div>

          {/* Our Office */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Our Office</p>
              <p className="text-sm font-medium text-white leading-relaxed">Plot. 99, Rajendra Park Near, S R<br/>Service, Sector 105, Gurugram - 122001.</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 mb-16"></div>

        {/* Main 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: About Us */}
          <div className="col-span-1">
            <h4 className="text-white font-semibold text-lg mb-6">About Us</h4>
            <p className="text-sm text-gray-400 leading-relaxed mb-8">
              Hatbaliya Technologies is an extremely versatile IT company, delivering a wide range of cutting-edge IT services. We specialize in providing innovative, scalable, and efficient solutions that help businesses thrive in the digital era.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#" className="flex items-center justify-center space-x-2 py-1.5 px-4 rounded-full border border-white/20 text-[10px] font-medium text-white hover:bg-white/10 transition-colors uppercase tracking-widest">
                <span>Facebook</span>
              </a>
              <a href="#" className="flex items-center justify-center space-x-2 py-1.5 px-4 rounded-full border border-white/20 text-[10px] font-medium text-white hover:bg-white/10 transition-colors uppercase tracking-widest">
                <span>Instagram</span>
              </a>
              <a href="#" className="flex items-center justify-center space-x-2 py-1.5 px-4 rounded-full border border-white/20 text-[10px] font-medium text-white hover:bg-white/10 transition-colors uppercase tracking-widest">
                <span>LinkedIn</span>
              </a>
              <a href="#" className="flex items-center justify-center space-x-2 py-1.5 px-4 rounded-full border border-white/20 text-[10px] font-medium text-white hover:bg-white/10 transition-colors uppercase tracking-widest">
                <span>YouTube</span>
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Services</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">UI/UX Designing</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Website Development</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Digital Marketing</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">SEO & Content Marketing</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Graphics Designing</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Custom Software Development</Link></li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Life @ Hatbaliya</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Why Choose us?</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 4: Address / Location Card */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">Address</h4>
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden group">
              {/* Abstract Map Graphic */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-[#273456] to-emerald-900 border border-white/10 flex items-center justify-center">
                 {/* Decorative elements representing map */}
                 <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-400 via-transparent to-transparent"></div>
                 <div className="relative w-3/4 h-3/4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl flex flex-col items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3 shadow-inner border border-white/10">
                      <MapPin className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="w-2/3 h-1.5 bg-white/30 rounded-full mb-2"></div>
                    <div className="w-1/2 h-1.5 bg-white/20 rounded-full"></div>
                 </div>
                 {/* Connecting dots */}
                 <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-400 rounded-full shadow-[0_0_10px_rgba(248,113,113,0.8)]"></div>
                 <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.8)]"></div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="w-full h-px bg-white/10 mb-8 mt-4"></div>
        <div className="flex flex-col md:flex-row justify-between items-center relative">
          <p className="text-sm text-gray-400">
            © 2024 Hatbaliya Technologies. All rights reserved.
          </p>
          
          <button 
            onClick={scrollToTop}
            className="md:absolute right-0 -top-4 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg hover:bg-gray-200 transition-colors focus:outline-none"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5 text-[#1f2844]" />
          </button>
        </div>
      </div>
    </footer>
  );
}
