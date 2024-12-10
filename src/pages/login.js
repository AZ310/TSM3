import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../config/supabaseClient';
import bcrypt from 'bcryptjs'; // For password comparison
import { useAuth } from './AuthContext'; // Import the useAuth hook

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { login } = useAuth(); // Function to update user context
  const navigate = useNavigate(); // Redirect hook

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('id, email, password_hash')
        .eq('email', email)
        .single();
  
      if (userError || !users) {
        throw new Error('Invalid email or password.');
      }
  
      const user = users;
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      if (!passwordMatch) {
        throw new Error('Invalid email or password.');
      }
  
      // Store the user in the authentication context and localStorage
      login(user);
  
      setSuccessMessage('Logged in successfully.');
      setError('');
  
      // Redirect to home page after login
      setTimeout(() => {
        setSuccessMessage('');
        navigate('/'); // Redirect to the home page
      }, 1000);
    } catch (err) {
      console.error('Login error:', err.message);
      setError(err.message);
  
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  return (
    <div>
      <div className="flex justify-between px-3 items-center border-b-2 border-gray-300">
        <Link to="/" className="flex items-center cursor-pointer">
          <img className="w-14" src="img/train.jpg" alt="website-logo" />
          <span className="font-bold px-0">TSM</span>
        </Link>
        <div>
          <h1 className="font-bold">Welcome to TSM</h1>
        </div>
      </div>
      <main className="py-20 flex justify-center items-center text-center">
        <div className="flex flex-col w-full md:w-[600px]">
          <div className="bg-gray-800 rounded shadow-md p-10 mb-2">
            <div className="pb-5 font-bold text-lg text-white">Log In</div>
            <form onSubmit={handleLogin}>
              <div className="text-left">
                <div className="flex items-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                  <input
                    className="bg-white rounded text-black text-sm md:text-base h-10 md:h-12 px-2 ml-2 shadow-md w-full"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex items-center mt-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
                    />
                  </svg>
                  <input
                    className="bg-white rounded text-black text-sm md:text-base h-10 md:h-12 px-2 ml-2 shadow-md w-full"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <div className="text-red-500 mb-2 text-right mt-2">{error}</div>}
                {successMessage && <div className="text-green-500 mb-2 text-right mt-2">{successMessage}</div>}
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-white text-black inline-flex items-center h-10 md:h-12 w-full md:w-[300px] justify-center text-center rounded text-sm md:text-base pt-1 transition ease-out hover:scale-105 shadow-md shadow-gray-400"
                >
                  Log In
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginComponent;
