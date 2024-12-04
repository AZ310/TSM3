import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AddTicketAdmin = () => {
    const [showAddForm, setShowAddForm] = useState(false);

    const toggleAddForm = () => {
        setShowAddForm(!showAddForm);
    };

    return (
        <div> {/* Content Wrapper */}
            <div className="flex justify-between px-3 items-center border-b-2 border-gray-300"> {/* Navigation Bar */}
                <Link to="/" className="flex items-center cursor-pointer"> {/* Link for the logo */}
                    <img className="w-14" src="img/train.jpg" alt="website-logo" />
                    <span className="font-bold px-0">TSM</span>
                </Link>
                <div className="ml-24">
                    <h1 className="font-bold">
                        Add Ticket (As Admin)
                    </h1>
                </div>
                <nav className="flex justify-start items-center">
                    <div className="mr-3 pr-3 border-r border-gray-800">
                        <a className="bg-white text-gray-800 border-2 rounded-full border-gray-800 p-2 transition ease-out hover:scale-105 hover:bg-gray-800 hover:text-white" href="recent.html">Recent Tickets</a>
                    </div>
                    <a href="login.html" className="bg-white text-gray-800 border-2 rounded-full border-gray-800 p-2 transition ease-out hover:scale-105 hover:bg-gray-800 hover:text-white">Sign in</a>
                    <a href="signup.html" className="bg-white text-gray-800 border-2 rounded-full border-gray-800 p-2 transition ease-out hover:scale-105 hover:bg-gray-800 hover:text-white">Sign up</a>
                </nav>
            </div>

            <main className="flex flex-col justify-center items-center mx-auto w-4/5">
                <div id="wholeWrapper" className="w-11/12 border border-gray-300 mt-6 mb-6 rounded-3xl bg-gray-50 flex flex-col justify-start items-center h-svh overflow-y-scroll">

                    {/* Ticket Wrapper (Example 1) */}
                    <div style={{ width: '96%' }} className="border border-gray-400 mt-4 rounded-2xl flex bg-white">
                        <div className="pl-2 border border-gray-600 w-32 m-1 rounded-xl flex flex-col justify-around">
                            <div>ID: 1</div>
                            <div>Flight ID: 1</div>
                            <div>Sex: M</div>
                        </div>
                        <div className="pl-2 border border-gray-600 w-52 m-1 rounded-xl flex flex-col justify-center items-center">
                            <div className="text-xl font-bold">DAMMAM</div>
                        </div>
                        <div className="pl-2 border border-gray-600 w-52 m-1 rounded-xl flex flex-col justify-around">
                            <div>Class: Business</div>
                            <div>Wifi?</div>
                        </div>
                        <div className="flex flex-col justify-end pl-2 rounded-xl m-1 w-56">
                            <div className="flex justify-end p-1">
                                <button className="bg-white text-gray-800 border-2 rounded-xl border-gray-800 p-1 transition ease-out hover:scale-105 hover:bg-gray-800 hover:text-white w-16 mr-2">Edit</button>
                                <button className="removeBtn bg-white text-gray-800 border-2 rounded-xl border-gray-800 p-1 transition ease-out hover:scale-105 hover:bg-gray-800 hover:text-white w-20">Remove</button>
                            </div>
                        </div>
                    </div>

                    {/* Ticket Wrapper (Example 2) */}
                    {/* Ticket Wrapper (Example 3) */}

                    {/* Add Ticket Form */}
                    <div id="addWrapper" style={{ width: '96%', display: showAddForm ? 'block' : 'none' }} className="border border-gray-400 mt-4 rounded-2xl flex bg-white">
                        <div className="pl-2 border border-gray-600 w-32 h-44 m-1 rounded-xl flex flex-col justify-start">
                            <form action="">
                                <input className="w-24 mt-2 p-1 border border-gray-400 rounded" type="text" placeholder="Sex:" name="sex" id="sex" />
                            </form>
                        </div>
                        <div className="pl-2 border border-gray-600 w-32 h-44 m-1 rounded-xl flex flex-col justify-start">
                            <form action="">
                                <input className="w-28 mt-2 p-1 border border-gray-400 rounded" type="text" placeholder="County/City:" id="city" />
                            </form>
                        </div>
                        <div className="pl-2 border border-gray-600 w-32 h-44 m-1 rounded-xl flex flex-col justify-start">
                            <form action="">
                                <input className="w-24 mt-2 p-1 border border-gray-400 rounded" type="text" placeholder="Class:" id="class" />
                                <input className="w-24 mt-2 p-1 border border-gray-400 rounded" type="text" placeholder="Wifi?" id="wifi" />
                            </form>
                        </div>
                        <div className="flex flex-col justify-end">
                            <button id="submitBtn" className="bg-white text-gray-800 border-2 rounded-xl border-gray-800 p-1 transition ease-out hover:scale-105 hover:bg-gray-800 hover:text-white w-40 mr-2 mb-2">Add</button>
                        </div>
                    </div>

                    {/* Add Ticket Button */}
                    <div id="addBtnWrapper" className="mt-6">
                        <button onClick={toggleAddForm} className="bg-white text-gray-800 border-2 rounded-xl border-gray-800 p-1 transition ease-out hover:scale-105 hover:bg-gray-800 hover:text-white w-40 mr-2">Add new ticket</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AddTicketAdmin;
