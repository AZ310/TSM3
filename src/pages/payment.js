import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../config/supabaseClient';

const PaymentPage = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [amount, setAmount] = useState(null); // State to store the amount

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const Fname = formData.get('Fname');
      const Lname = formData.get('Lname');
  
      const operationId = Math.floor(Math.random() * 1000000);
      const generatedAmount = Math.floor(Math.random() * (500 - 100 + 1)) + 100; // Generate random amount
      setAmount(generatedAmount); // Set the generated amount to state

      const status = true; // Assuming payment is successful if reaching this point
  
      await supabase.from('payment').insert([
        {
          Fname: Fname,
          Lname: Lname,
          amount: parseFloat(generatedAmount), // Use the generated amount
          status: status,
          operation_id: parseInt(operationId),
        },
      ]);
  
      setSuccessMessage('Payment successful.');
      setErrorMessage('');
      e.target.reset();
    } catch (error) {
      console.error('Error processing payment:', error.message);
      setErrorMessage('Error processing payment. Please try again later.');
      setSuccessMessage('');
    }
  };
  

  return (
    <div>
      <div className="flex justify-between px-3 items-center border-b-2 border-gray-300">
        <Link to="/" className="flex items-center cursor-pointer">
          <img className="w-14" src="img/train.jpg" alt="website-logo" />
          <span className="font-bold px-0">TSM</span>
        </Link>
        <div className="ml-24">
          <h1 className="font-bold">Payment</h1>
        </div>
        <nav>
          <a href="login.html" className="bg-white text-gray-800 border-2 rounded-full border-gray-800 p-2 transition ease-out hover:scale-105 hover:bg-gray-800 hover:text-white">Sign in</a>
          <a href="signup.html" className="bg-white text-gray-800 border-2 rounded-full border-gray-800 p-2 transition ease-out hover:scale-105 hover:bg-gray-800 hover:text-white">Sign up</a>
        </nav>
      </div>
      <main className="flex mx-auto w-4/5">
        <div className="border border-gray-300 h-svh w-full">
          <div>
            <div className="w-4/5 bg-gray-100 flex flex-col justify-center items-center h-12">
              <h1 className="font-bold text-lg">
                Enter Your Payment Details
              </h1>
            </div>
            <div className="w-4/5 border border-gray-300 flex flex-col justify-center items-center">
              {successMessage && <div className="text-green-500 mb-2 text-center mt-2">{successMessage}</div>}
              {errorMessage && <div className="text-red-500 mb-2 text-center mt-2">{errorMessage}</div>}
              <div className="m-6">
                <form onSubmit={handlePayment}>
                  <input type="text" placeholder="First Name" name="Fname" className="border border-gray-400 mr-9 rounded p-1" />
                  <input type="text" placeholder="Last Name" name="Lname" className="border border-gray-400 mr-9 rounded p-1" />
                  <input type="text" placeholder="CVV" name="cvv" className="border border-gray-400 mr-9 rounded p-1" />
                  <input type="text" placeholder="Card Number" name="cardNumber" className="border border-gray-400 mr-9 rounded p-1" />
                  {amount && <div>Amount: <strong>{amount}</strong></div>} {/* Display the amount */}
                </form>
              </div>
              <div>
                <form onSubmit={handlePayment}>
                  <button type="submit" className="bg-gray-800 text-white border-2 rounded border-gray-800 p-2 transition ease-out hover:scale-105 mt-6 mr-9 w-32 mb-9">
                    Pay
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentPage;
