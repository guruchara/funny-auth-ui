import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

/* ============================================================================
   SUB COMPONENTS (MOVED OUTSIDE — IMPORTANT)
============================================================================ */

const PasswordRequirement = ({ met, text }) => (
  <div className="flex items-center gap-2">
    {met ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
    )}
    <span className={`text-xs ${met ? 'text-green-600' : 'text-gray-500'}`}>
      {text}
    </span>
  </div>
);

const PasswordStrength = ({ password, validatePassword }) => {
  const strength = validatePassword(password);

  return (
    <div className="mt-2 space-y-1">
      <p className="text-xs text-gray-600 font-medium">
        Password must contain:
      </p>
      <PasswordRequirement met={strength.minLength} text="At least 8 characters" />
      <PasswordRequirement met={strength.hasUpperCase} text="One uppercase letter" />
      <PasswordRequirement met={strength.hasLowerCase} text="One lowercase letter" />
      <PasswordRequirement met={strength.hasNumber} text="One number" />
    </div>
  );
};

const InputField = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  showPasswordToggle,
  passwordVisible,
  onTogglePassword,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>

    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-11 ${
          showPasswordToggle ? 'pr-11' : 'pr-4'
        } py-3 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition`}
      />

      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {passwordVisible ? <EyeOff /> : <Eye />}
        </button>
      )}
    </div>

    {error && (
      <div className="flex items-center gap-2 mt-2">
        <AlertCircle className="w-4 h-4 text-red-500" />
        <p className="text-sm text-red-500">{error}</p>
      </div>
    )}
  </div>
);

/* ============================================================================
   MAIN COMPONENT
============================================================================ */

const AuthUI = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  /* ===================== VALIDATION ===================== */

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) => ({
    isValid:
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password),
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  });

  /* ===================== HANDLERS ===================== */

  const handleLoginSubmit = () => {
    const newErrors = {};
    if (!loginForm.email || !validateEmail(loginForm.email))
      newErrors.email = 'Valid email required';
    if (!loginForm.password)
      newErrors.password = 'Password required';

    setErrors(newErrors);

    if (!Object.keys(newErrors).length) {
      setSuccessMessage('Login successful!');
    }
  };

  const handleSignupSubmit = () => {
    const newErrors = {};

    if (!signupForm.name) newErrors.name = 'Name required';
    if (!validateEmail(signupForm.email))
      newErrors.email = 'Valid email required';
    if (!validatePassword(signupForm.password).isValid)
      newErrors.password = 'Weak password';
    if (signupForm.password !== signupForm.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);

    if (!Object.keys(newErrors).length) {
      setSuccessMessage('Account created successfully!');
      setIsLogin(true);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setSuccessMessage('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  /* ===================== RENDER ===================== */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <h1 className="text-2xl font-bold">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
        </div>

        {successMessage && (
          <div className="m-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-2">
            <CheckCircle className="text-green-600" />
            <p className="text-green-800 text-sm">{successMessage}</p>
          </div>
        )}

        <div className="p-6 space-y-5">
          {isLogin ? (
            <>
              <InputField
                label="Email"
                type="email"
                value={loginForm.email}
                onChange={(v) => setLoginForm({ ...loginForm, email: v })}
                placeholder="you@email.com"
                icon={Mail}
                error={errors.email}
              />

              <InputField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={loginForm.password}
                onChange={(v) => setLoginForm({ ...loginForm, password: v })}
                placeholder="••••••••"
                icon={Lock}
                error={errors.password}
                showPasswordToggle
                passwordVisible={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />

              <button
                onClick={handleLoginSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              <InputField
                label="Name"
                type="text"
                value={signupForm.name}
                onChange={(v) => setSignupForm({ ...signupForm, name: v })}
                placeholder="John Doe"
                icon={User}
                error={errors.name}
              />

              <InputField
                label="Email"
                type="email"
                value={signupForm.email}
                onChange={(v) => setSignupForm({ ...signupForm, email: v })}
                placeholder="you@email.com"
                icon={Mail}
                error={errors.email}
              />

              <InputField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={signupForm.password}
                onChange={(v) => setSignupForm({ ...signupForm, password: v })}
                placeholder="••••••••"
                icon={Lock}
                error={errors.password}
                showPasswordToggle
                passwordVisible={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />

              {signupForm.password && (
                <PasswordStrength
                  password={signupForm.password}
                  validatePassword={validatePassword}
                />
              )}

              <InputField
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={signupForm.confirmPassword}
                onChange={(v) =>
                  setSignupForm({ ...signupForm, confirmPassword: v })
                }
                placeholder="••••••••"
                icon={Lock}
                error={errors.confirmPassword}
                showPasswordToggle
                passwordVisible={showConfirmPassword}
                onTogglePassword={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              />

              <button
                onClick={handleSignupSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
              >
                Create Account
              </button>
            </>
          )}

          <p className="text-center text-sm text-gray-600">
            {isLogin ? 'No account?' : 'Already have an account?'}{' '}
            <button
              onClick={toggleForm}
              className="text-blue-600 font-semibold"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthUI;
