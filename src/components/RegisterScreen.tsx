import React, { useState } from 'react';
import { registerUser } from '../services/auth';

/**
 * RegisterScreen Component
 * 
 * Provides a futuristic neon-themed registration page for WordMaster.
 * Validations included:
 * 1. Name: must begin with a capital letter (A-Z)
 * 2. Password: must contain at least one digit (0-9)
 * 3. ID Number: must consist of exactly 9 digits
 * 4. Phone Number: must be 12 digits long (including international country code)
 * 5. Age: must be greater than 3
 * 
 * When any validation fails, the field text and border turn red, and an error message is displayed.
 */
export default function RegisterScreen() {
  // Individual state variable for each form field (no combined data collection)
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [age, setAge] = useState('');
  const [referralSource, setReferralSource] = useState('');
  const [selectedBand, setSelectedBand] = useState('1');

  // Email field — required by Firebase Auth for login
  const [email, setEmail] = useState('');

  // State to toggle password visibility (plain text vs masked dots)
  const [showPassword, setShowPassword] = useState(false);

  // True while the registration request is in progress (disables the button)
  const [isLoading, setIsLoading] = useState(false);

  // General error message from Firebase (e.g. "email already in use")
  const [firebaseError, setFirebaseError] = useState('');

  // Individual error states for each validated field
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [idNumberError, setIdNumberError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [ageError, setAgeError] = useState('');

  // 1. Full Name Change Handler: must begin with a capital letter (A-Z)
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFullName(val);

    if (val !== '' && !/^[A-Z]/.test(val)) {
      setFullNameError('Name must begin with a capital letter (A-Z)');
    } else {
      setFullNameError('');
    }
  };

  // Email Change Handler: must be a valid email format
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);

    // Simple check: must contain @ and a dot after @
    if (val !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  // 2. Password Change Handler: must contain at least one digit (0-9)
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);

    if (val !== '' && !/\d/.test(val)) {
      setPasswordError('Password must contain at least one digit (0-9)');
    } else {
      setPasswordError('');
    }
  };

  // 3. ID Number Change Handler: must consist of exactly 9 digits
  const handleIdNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setIdNumber(val);

    if (val !== '' && !/^\d{9}$/.test(val)) {
      setIdNumberError('ID number must consist of exactly 9 digits');
    } else {
      setIdNumberError('');
    }
  };

  // 4. Phone Number Change Handler: must be 12 digits long including country code
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPhoneNumber(val);

    // Extract all numeric digits (ignoring '+' or spaces) to count total digits
    const digitsOnly = val.replace(/\D/g, '');
    if (val !== '' && digitsOnly.length !== 12) {
      setPhoneNumberError('Phone must be 12 digits including country code (e.g. +972500000000)');
    } else {
      setPhoneNumberError('');
    }
  };

  // 5. Age Change Handler: must be strictly greater than 3
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAge(val);

    if (val !== '' && Number(val) <= 3) {
      setAgeError('Age must be greater than 3');
    } else {
      setAgeError('');
    }
  };

  // Form submission handler: validates all fields, then registers with Firebase
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear any previous Firebase error
    setFirebaseError('');

    let hasError = false;

    // Validate Full Name
    if (!fullName || !/^[A-Z]/.test(fullName)) {
      setFullNameError('Name must begin with a capital letter (A-Z)');
      hasError = true;
    }

    // Validate Email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }

    // Validate Password
    if (!password || !/\d/.test(password)) {
      setPasswordError('Password must contain at least one digit (0-9)');
      hasError = true;
    }

    // Firebase requires passwords to be at least 6 characters long
    if (password && password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      hasError = true;
    }

    // Validate ID Number
    if (!idNumber || !/^\d{9}$/.test(idNumber)) {
      setIdNumberError('ID number must consist of exactly 9 digits');
      hasError = true;
    }

    // Validate Phone Number
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (!phoneNumber || digitsOnly.length !== 12) {
      setPhoneNumberError('Phone must be 12 digits including country code (e.g. +972500000000)');
      hasError = true;
    }

    // Validate Age
    if (!age || Number(age) <= 3) {
      setAgeError('Age must be greater than 3');
      hasError = true;
    }

    // Stop if any field failed validation
    if (hasError) {
      return;
    }

    // All validations passed — attempt Firebase registration
    setIsLoading(true);

    try {
      // Call our auth service to create the account + save data
      await registerUser(email, password, {
        username,
        fullName,
        email,
        idNumber,
        phoneNumber,
        age: Number(age),
        referralSource,
        selectedBand,
      });

      // Registration succeeded!
      alert('Registration successful! Welcome to WordMaster 🎉');
      // TODO: navigate to the Dashboard screen

    } catch (error: unknown) {
      // Firebase threw an error — show a user-friendly message
      // The 'code' property tells us what went wrong
      const firebaseErr = error as { code?: string; message?: string };

      if (firebaseErr.code === 'auth/email-already-in-use') {
        setFirebaseError('This email is already registered. Try logging in instead.');
      } else if (firebaseErr.code === 'auth/invalid-email') {
        setFirebaseError('The email address is not valid.');
      } else if (firebaseErr.code === 'auth/weak-password') {
        setFirebaseError('Password is too weak. Use at least 6 characters.');
      } else {
        // Fallback for any other error
        setFirebaseError(firebaseErr.message || 'Registration failed. Please try again.');
      }
    } finally {
      // Re-enable the button whether it succeeded or failed
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0b0e14] text-white font-sans relative overflow-x-hidden">
      {/* Scoped CSS for neon glows, font styles, and radial background */}
      <style>{`
        .bg-animate {
          background: radial-gradient(circle at top right, #1a0b2e, #0b0e14 60%);
        }
        .text-glow-purple {
          text-shadow: 0 0 8px #bc13fe;
        }
        .text-glow-cyan {
          text-shadow: 0 0 8px #05ffa1;
        }
        .shadow-neon-cyan {
          box-shadow: 0 0 10px #05ffa1, 0 0 20px #05ffa1;
        }
        .shadow-neon-purple {
          box-shadow: 0 0 10px #bc13fe, 0 0 20px #bc13fe;
        }
      `}</style>

      {/* Background radial gradient layer */}
      <div className="absolute inset-0 bg-animate pointer-events-none" />

      {/* BEGIN: Registration Container Card */}
      <main
        className="w-full max-w-lg bg-black/60 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-[#05ffa1]/30 shadow-2xl my-8 relative z-10 text-left"
        data-purpose="login-card"
      >
        {/* BEGIN: Header Section */}
        <header className="text-center mb-6">
          <h1 className="text-4xl font-extrabold uppercase tracking-widest text-glow-purple italic text-[#bc13fe] mb-2 font-['Poppins',sans-serif]">
            WordMaster
          </h1>
          <p className="text-slate-400 text-sm tracking-wide uppercase">
            Enter the Digital Arena
          </p>
        </header>
        {/* END: Header Section */}

        {/* BEGIN: Form Section */}
        <form onSubmit={handleSubmit} className="space-y-4" data-purpose="registration-form">
          {/* Firebase Error Banner — shows errors like "email already in use" */}
          {firebaseError && (
            <div className="bg-red-500/10 border border-red-500/40 rounded-xl px-4 py-3 text-sm text-red-400 font-medium">
              {firebaseError}
            </div>
          )}

          {/* Username & Full Name Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Username Field */}
            <div className="space-y-1.5">
              <label
                className="block text-xs font-semibold uppercase tracking-wider text-[#05ffa1] ml-1"
                htmlFor="reg-username"
              >
                Username
              </label>
              <div className="relative">
                <input
                  className="w-full bg-white/5 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-[#05ffa1] focus:ring-1 focus:ring-[#05ffa1] outline-none transition-all duration-300 placeholder:text-slate-600 font-medium tracking-wide"
                  id="reg-username"
                  placeholder="e.g. cyber_learner"
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Full Name Field (must begin with a capital letter) */}
            <div className="space-y-1.5">
              <label
                className="block text-xs font-semibold uppercase tracking-wider text-[#05ffa1] ml-1"
                htmlFor="reg-fullname"
              >
                Full Name
              </label>
              <div className="relative">
                <input
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 font-medium ${
                    fullNameError
                      ? 'text-red-500 border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'text-white border-slate-700 focus:border-[#05ffa1] focus:ring-1 focus:ring-[#05ffa1] placeholder:text-slate-600'
                  }`}
                  id="reg-fullname"
                  placeholder="John Doe"
                  required
                  type="text"
                  value={fullName}
                  onChange={handleFullNameChange}
                />
                <div
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                    fullNameError ? 'text-red-500' : 'text-slate-500'
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
              {/* Full Name Error Message */}
              {fullNameError && (
                <p className="text-xs text-red-500 mt-1 ml-1 font-semibold">{fullNameError}</p>
              )}
            </div>
          </div>

          {/* Email Field — required by Firebase for authentication */}
          <div className="space-y-1.5">
            <label
              className="block text-xs font-semibold uppercase tracking-wider text-[#05ffa1] ml-1"
              htmlFor="reg-email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 font-medium ${
                  emailError
                    ? 'text-red-500 border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'text-white border-slate-700 focus:border-[#05ffa1] focus:ring-1 focus:ring-[#05ffa1] placeholder:text-slate-600'
                }`}
                id="reg-email"
                placeholder="you@example.com"
                required
                type="email"
                value={email}
                onChange={handleEmailChange}
              />
              <div
                className={`absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                  emailError ? 'text-red-500' : 'text-slate-500'
                }`}
              >
                {/* Email icon (envelope) */}
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
            {/* Email Error Message */}
            {emailError && (
              <p className="text-xs text-red-500 mt-1 ml-1 font-semibold">{emailError}</p>
            )}
          </div>

          {/* Password Field (must contain at least one digit) */}
          <div className="space-y-1.5">
            <label
              className="block text-xs font-semibold uppercase tracking-wider text-[#05ffa1] ml-1"
              htmlFor="reg-password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 font-medium tracking-widest pr-11 ${
                  passwordError
                    ? 'text-red-500 border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'text-white border-slate-700 focus:border-[#05ffa1] focus:ring-1 focus:ring-[#05ffa1] placeholder:text-slate-600'
                }`}
                id="reg-password"
                placeholder="••••••••"
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
              />
              <button
                aria-label="Toggle password visibility"
                className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors focus:outline-none cursor-pointer ${
                  passwordError ? 'text-red-500 hover:text-red-400' : 'text-slate-500 hover:text-[#05ffa1]'
                }`}
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            </div>
            {/* Password Error Message */}
            {passwordError && (
              <p className="text-xs text-red-500 mt-1 ml-1 font-semibold">{passwordError}</p>
            )}
          </div>

          {/* ID Number & Phone Number Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* ID Number Field (must be exactly 9 digits) */}
            <div className="space-y-1.5">
              <label
                className="block text-xs font-semibold uppercase tracking-wider text-[#05ffa1] ml-1"
                htmlFor="reg-idnum"
              >
                ID Number
              </label>
              <div className="relative">
                <input
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 font-medium ${
                    idNumberError
                      ? 'text-red-500 border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'text-white border-slate-700 focus:border-[#05ffa1] focus:ring-1 focus:ring-[#05ffa1] placeholder:text-slate-600'
                  }`}
                  id="reg-idnum"
                  placeholder="9-digit ID"
                  required
                  type="text"
                  value={idNumber}
                  onChange={handleIdNumberChange}
                />
                <div
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                    idNumberError ? 'text-red-500' : 'text-slate-500'
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
              {/* ID Number Error Message */}
              {idNumberError && (
                <p className="text-xs text-red-500 mt-1 ml-1 font-semibold">{idNumberError}</p>
              )}
            </div>

            {/* Phone Number Field (must be 12 digits including country code) */}
            <div className="space-y-1.5">
              <label
                className="block text-xs font-semibold uppercase tracking-wider text-[#05ffa1] ml-1"
                htmlFor="reg-phone"
              >
                Phone Number
              </label>
              <div className="relative">
                <input
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 font-medium ${
                    phoneNumberError
                      ? 'text-red-500 border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'text-white border-slate-700 focus:border-[#05ffa1] focus:ring-1 focus:ring-[#05ffa1] placeholder:text-slate-600'
                  }`}
                  id="reg-phone"
                  placeholder="+972500000000"
                  required
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                />
                <div
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                    phoneNumberError ? 'text-red-500' : 'text-slate-500'
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
              {/* Phone Number Error Message */}
              {phoneNumberError && (
                <p className="text-xs text-red-500 mt-1 ml-1 font-semibold">{phoneNumberError}</p>
              )}
            </div>
          </div>

          {/* Age & Referral Source Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Age Field (must be > 3) */}
            <div className="space-y-1.5">
              <label
                className="block text-xs font-semibold uppercase tracking-wider text-[#05ffa1] ml-1"
                htmlFor="reg-age"
              >
                Age
              </label>
              <div className="relative">
                <input
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 font-medium ${
                    ageError
                      ? 'text-red-500 border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'text-white border-slate-700 focus:border-[#05ffa1] focus:ring-1 focus:ring-[#05ffa1] placeholder:text-slate-600'
                  }`}
                  id="reg-age"
                  placeholder="e.g. 15"
                  required
                  type="number"
                  value={age}
                  onChange={handleAgeChange}
                />
                <div
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                    ageError ? 'text-red-500' : 'text-slate-500'
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
              {/* Age Error Message */}
              {ageError && (
                <p className="text-xs text-red-500 mt-1 ml-1 font-semibold">
                  {ageError}
                </p>
              )}
            </div>

            {/* Referral Source Field */}
            <div className="space-y-1.5">
              <label
                className="block text-xs font-semibold uppercase tracking-wider text-[#05ffa1] ml-1"
                htmlFor="reg-referral"
              >
                How did you hear about us?
              </label>
              <div className="relative">
                <select
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-[#05ffa1] focus:ring-1 focus:ring-[#05ffa1] outline-none transition-all duration-300 font-medium cursor-pointer appearance-none pr-10"
                  id="reg-referral"
                  required
                  value={referralSource}
                  onChange={(e) => setReferralSource(e.target.value)}
                >
                  <option className="bg-slate-900 text-slate-400" disabled value="">
                    Select an option
                  </option>
                  <option className="bg-slate-900 text-white" value="school">
                    School / Teacher
                  </option>
                  <option className="bg-slate-900 text-white" value="social">
                    Social Media
                  </option>
                  <option className="bg-slate-900 text-white" value="friend">
                    Friend Recommendation
                  </option>
                  <option className="bg-slate-900 text-white" value="google">
                    Google Search
                  </option>
                  <option className="bg-slate-900 text-white" value="other">
                    Other
                  </option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M19 9l-7 7-7-7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Select Band Level */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs font-semibold uppercase tracking-widest text-[#05ffa1]">
                Select Band Level
              </label>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">
                Proficiency
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {['1', '2', '3'].map((band) => {
                const isSelected = selectedBand === band;
                return (
                  <button
                    key={band}
                    type="button"
                    onClick={() => setSelectedBand(band)}
                    className={`rounded-xl py-2.5 text-center transition-all font-bold text-sm border cursor-pointer ${
                      isSelected
                        ? 'border-[#bc13fe] bg-[#bc13fe]/20 shadow-neon-purple text-white'
                        : 'bg-white/5 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    B{band}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button — disabled while Firebase registration is in progress */}
          <button
            className={`w-full bg-[#05ffa1]/10 border-2 border-[#05ffa1] text-[#05ffa1] font-['Poppins',sans-serif] font-bold text-base py-3.5 rounded-xl hover:bg-[#05ffa1] hover:text-black transition-all duration-300 shadow-neon-cyan uppercase tracking-[0.2em] mt-3 active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            data-purpose="start-game-button"
            type="submit"
            disabled={isLoading}
          >
            <span>{isLoading ? 'Creating Account...' : 'Create Account / Start'}</span>
            {!isLoading && (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            )}
          </button>
        </form>
        {/* END: Form Section */}

        {/* Footer Decoration */}
        <footer className="mt-8 flex justify-center space-x-2">
          <div className="h-1 w-8 bg-[#bc13fe] rounded-full opacity-50" />
          <div className="h-1 w-16 bg-[#05ffa1] rounded-full" />
          <div className="h-1 w-8 bg-[#bc13fe] rounded-full opacity-50" />
        </footer>
      </main>
      {/* END: Registration Container Card */}
    </div>
  );
}
