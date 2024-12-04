import React, { useState } from 'react';
import supabase from '../config/supabaseClient';
import { Link } from 'react-router-dom';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    Fname: '',
    Lname: '',
    authority: 'User', // Default to 'User' authority
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
      // Insert new user into the database
      const { data, error } = await supabase
        .from('user')
        .insert([
          {
            email: formData.email,
            password: formData.password,
            Fname: formData.Fname,
            Lname: formData.Lname,
            phone: formData.phone,
            authority: formData.authority,
            updated_at: new Date().toISOString(),
          },
        ]);

      if (error) {
        throw error;
      }

      // Reset form data
      setFormData({
        email: '',
        phone: '',
        password: '',
        Fname: '',
        Lname: '',
        authority: 'User',
      });

      // Show success message
      setSuccessMessage('Successfully added information.');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };

  return (
    <div> {/* Content Wrapper */}
      <div className="flex justify-between px-3 items-center border-b-2 border-gray-300"> {/* Navigation Bar */}
        <Link to="/" className="flex items-center cursor-pointer"> {/* Link for the logo */}
          <img className="w-14" src="img/train.jpg" alt="website-logo" />
          <span className="font-bold px-0">TSM</span>
        </Link>
        <div>
          <h1 className="font-bold">
            Welcome to TSM
          </h1>
        </div>
        <nav>
          <Link to="/login" className="bg-white text-gray-800 border-2 rounded-full border-gray-800 p-2 transition ease-out hover:scale-105 hover:bg-gray-800 hover:text-white">Sign in</Link>
        </nav>
      </div>
      <main className="py-20 flex justify-center items-center text-center">
        <div className="flex flex-col w-[600px]"> {/* Log In box */}
          <div className="bg-gray-800 rounded shadow-md p-10 mb-2">
            <div className="pb-5 font-bold text-lg text-white">
              Create a new Account
            </div>
            <form onSubmit={handleSubmit}>
            <div className="text-left">
                <div className="flex justify-center items-center m-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-9 h-9 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  <input type="text" id="Fname" name="Fname" value={formData.Fname} onChange={handleChange} placeholder="Enter Your First Name" className="bg-white rounded text-black text-sm md:text-base h-10 md:h-12 px-2 ml-2 mr-2 shadow-md w-full" />
                  <input type="text" id="Lname" name="Lname" value={formData.Lname} onChange={handleChange} placeholder="Enter Your Last Name" className="bg-white rounded text-black text-sm md:text-base h-10 md:h-12 px-2 ml-2 shadow-md w-full" />
                </div>
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="bg-white rounded text-black text-sm md:text-base h-10 md:h-12 px-2 ml-2 shadow-md w-full" placeholder="Enter your email" />
                </div>
                <div className="flex justify-center items-center mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="bg-white rounded text-black text-sm md:text-base h-10 md:h-12 px-2 ml-2 shadow-md w-full" placeholder="Enter your phone number" />
                </div>
                <div className="flex items-center mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                  </svg>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} className="bg-white rounded text-black text-sm md:text-base h-10 md:h-12 px-2 ml-2 shadow-md w-full" placeholder="Enter your password" />
                </div>
                <div className="flex justify-center items-center mt-2">
                  <select name="authority" value={formData.authority} onChange={handleChange}>
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>
              <div> {/* Sign Up Button */}
                <button type="submit" className="bg-white text-black inline-flex items-center h-10 md:h-12 w-full md:w-[300px] justify-center text-center rounded text-sm md:text-base pt-1 transition ease-out hover:scale-105 shadow-md shadow-gray-400">
                  Sign Up
                </button>
              </div>
            </form>
          </div>
          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-500 text-white px-4 py-2 rounded mt-2">
              {errorMessage}
            </div>
          )}
          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-500 text-white px-4 py-2 rounded mt-2">
              {successMessage}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SignUpForm;
