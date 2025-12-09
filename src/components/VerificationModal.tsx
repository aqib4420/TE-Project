import React, { useState } from 'react';
import { Mail, CheckCircle, X } from 'lucide-react';

interface VerificationModalProps {
  email: string;
  onVerify: (code: string) => void;
  onResend: () => void;
  onClose: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ email, onVerify, onResend, onClose }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 4) {
        setError("Please enter the 4-digit code.");
        return;
    }
    onVerify(code);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all scale-100">
        <div className="bg-gradient-to-r from-premium-royal to-premium-indigo p-6 text-center relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white">
                <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">Verify Your Email</h3>
            <p className="text-blue-100 text-sm mt-1">We sent a code to {email}</p>
        </div>
        
        <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Enter Verification Code
                    </label>
                    <input 
                        type="text" 
                        maxLength={4}
                        value={code}
                        onChange={(e) => { setCode(e.target.value.replace(/[^0-9]/g, '')); setError(''); }}
                        className="w-full text-center text-3xl tracking-[1em] font-bold py-3 border-b-2 border-gray-300 dark:border-gray-600 focus:border-premium-royal bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-300 transition-colors"
                        placeholder="0000"
                        autoFocus
                    />
                    {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-premium-royal to-premium-indigo text-white py-3 rounded-full font-bold hover:shadow-[0_0_20px_rgba(6,214,160,0.5)] transition-all shadow-lg"
                >
                    Verify Account
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm">Didn't receive code?</p>
                <button 
                    onClick={() => { onResend(); alert(`New code sent to ${email}`); }}
                    className="text-premium-royal font-bold text-sm hover:underline mt-1"
                >
                    Resend Code
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};