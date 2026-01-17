import React, { useState, useEffect, useRef } from 'react';

export default function FunnyLoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [eyesOpen, setEyesOpen] = useState(true);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [passwordFocused, setPasswordFocused] = useState(false);
  const faceRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!faceRef.current || passwordFocused) return;

      const face = faceRef.current.getBoundingClientRect();
      const faceCenterX = face.left + face.width / 2;
      const faceCenterY = face.top + face.height / 2;

      const deltaX = e.clientX - faceCenterX;
      const deltaY = e.clientY - faceCenterY;

      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2) / 50, 8);

      setEyePosition({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [passwordFocused]);

  const handlePasswordFocus = () => {
    setPasswordFocused(true);
    setEyesOpen(false);
  };

  const handlePasswordBlur = () => {
    setPasswordFocused(false);
    setEyesOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* Animated Face */}
        <div ref={faceRef} className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 bg-yellow-400 rounded-full relative shadow-lg">
            {/* Eyes */}
            <div className="absolute top-10 left-6 w-10 h-12 bg-white rounded-full overflow-hidden shadow-inner">
              {eyesOpen ? (
                <div
                  className="w-6 h-6 bg-black rounded-full absolute top-3 left-2 transition-transform duration-100"
                  style={{
                    transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`,
                  }}
                >
                  <div className="w-2 h-2 bg-white rounded-full absolute top-1 left-1"></div>
                </div>
              ) : (
                <div className="w-full h-1 bg-black absolute top-6 rounded-full"></div>
              )}
            </div>
            <div className="absolute top-10 right-6 w-10 h-12 bg-white rounded-full overflow-hidden shadow-inner">
              {eyesOpen ? (
                <div
                  className="w-6 h-6 bg-black rounded-full absolute top-3 left-2 transition-transform duration-100"
                  style={{
                    transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`,
                  }}
                >
                  <div className="w-2 h-2 bg-white rounded-full absolute top-1 left-1"></div>
                </div>
              ) : (
                <div className="w-full h-1 bg-black absolute top-6 rounded-full"></div>
              )}
            </div>

            {/* Mouth */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="w-12 h-6 border-b-4 border-black rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Toggle Buttons */}
        <div className="flex gap-2 mb-6 bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-full font-semibold transition-all ${
              isLogin ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-full font-semibold transition-all ${
              !isLogin ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-600 focus:outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-600 focus:outline-none transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-600 focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          {isLogin && (
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-purple-600 hover:text-purple-700">
                Forgot password?
              </a>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-600 font-semibold hover:text-purple-700"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}