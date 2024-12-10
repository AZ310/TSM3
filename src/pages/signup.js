import React, { useState } from 'react';
import supabase from '../config/supabaseClient';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // For generating unique session IDs and tokens
import bcrypt from 'bcryptjs'; // For password hashing

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    Fname: '',
    Lname: '',
    authority: 'Passenger', // Default to 'Passenger'
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!formData.email || !formData.password || !formData.Fname || !formData.Lname) {
      setErrorMessage('Please fill in all fields.');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      return;
    }

    try {
      // Step 1: Hash the password
      const hashedPassword = await bcrypt.hash(formData.password, 10);

      // Step 2: Insert the user into the database
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert([{
          email: formData.email,
          password_hash: hashedPassword, // Store hashed password
          name: `${formData.Fname} ${formData.Lname}`,
          role: formData.authority, // Default to 'Passenger'
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (userError) {
        throw userError;
      }

      // Step 3: Create a session for the user
      const sessionID = uuidv4(); // Unique session ID
      const token = uuidv4(); // Generate a random token
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

      const { error: sessionError } = await supabase
        .from('sessions')
        .insert([{
          user_id: user.id, // Reference the newly created user
          session_id: sessionID,
          expires_at: expiresAt.toISOString(),
          is_active: true,
          user_agent: navigator.userAgent, // Browser info
          ip_address: '127.0.0.1', // For demonstration purposes, use the actual IP address in a production app
        }]);

      if (sessionError) {
        throw sessionError;
      }

      // Save token and sessionID to localStorage (or cookies for better security)
      localStorage.setItem('authToken', token);
      localStorage.setItem('sessionID', sessionID);

      // Reset form data
      setFormData({
        email: '',
        password: '',
        Fname: '',
        Lname: '',
        authority: 'Passenger', // Default to 'Passenger'
      });

      // Show success message
      setSuccessMessage('Account created successfully. Token and session saved.');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (error) {
      console.error('Error signing up:', error.message);
      setErrorMessage('Failed to sign up. Please try again.');
      setTimeout(() => {
        setErrorMessage('');
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
        <nav>
          <Link
            to="/login"
            className="bg-white text-gray-800 border-2 rounded-full border-gray-800 p-2 transition ease-out hover:scale-105 hover:bg-gray-800 hover:text-white"
          >
            Sign in
          </Link>
        </nav>
      </div>
      <main className="py-20 flex justify-center items-center text-center">
        <div className="flex flex-col w-[600px]">
          <div className="bg-gray-800 rounded shadow-md p-10 mb-2">
            <div className="pb-5 font-bold text-lg text-white">Create a new Account</div>
            <form onSubmit={handleSubmit}>
              <div className="text-left">
                <div className="flex justify-center items-center m-2">
                  <input
                    type="text"
                    id="Fname"
                    name="Fname"
                    value={formData.Fname}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="bg-white rounded text-black text-sm md:text-base h-10 md:h-12 px-2 ml-2 mr-2 shadow-md w-full"
                  />
                  <input
                    type="text"
                    id="Lname"
                    name="Lname"
                    value={formData.Lname}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="bg-white rounded text-black text-sm md:text-base h-10 md:h-12 px-2 ml-2 shadow-md w-full"
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-white rounded text-black h-10 px-2 ml-2 shadow-md w-full"
                  placeholder="Enter your email"
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-white rounded text-black h-10 px-2 ml-2 shadow-md w-full"
                  placeholder="Enter your password"
                />
                <select
                  name="authority"
                  value={formData.authority}
                  onChange={handleChange}
                  className="bg-white rounded text-black text-sm mt-2 px-2 ml-2 w-full"
                >
                  <option value="Passenger">Passenger</option>
                  <option value="Admin">Admin</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-white text-black inline-flex items-center h-12 w-full rounded mt-4 mb-3 hover:bg-gray-800 hover:text-white"
              >
                Create Account
              </button>
            </form>
            {successMessage && <div className="text-green-500">{successMessage}</div>}
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUpForm;
