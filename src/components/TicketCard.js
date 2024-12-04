import React, { useState, useEffect } from 'react';
import EditTicketModal from '../pages/EditTicketModal';
import supabase from '../config/supabaseClient';

const TicketCard = ({ ticket, removeTicket }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showLuggage, setShowLuggage] = useState(false);
    const [luggageData, setLuggageData] = useState([]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleClose = () => {
        setIsEditing(false);
    };

    const handleToggleLuggage = async () => {
        if (!showLuggage) {
            try {
                const { data, error } = await supabase
                    .from('Luggage')
                    .select('*')
                    .eq('id', ticket.id);

                if (error) {
                    throw error;
                }

                setLuggageData(data);
                setShowLuggage(true);
            } catch (error) {
                console.error('Error fetching luggage data:', error.message);
            }
        } else {
            setShowLuggage(false);
            setLuggageData([]);
        }
    };

    return (
        <div className="border border-gray-400 mt-4 rounded-2xl flex bg-white">
            <div className="pl-2 border border-gray-600 w-32 m-1 rounded-xl flex flex-col justify-around">
                <div>ID: {ticket.id}</div>
                <div>Flight ID: {ticket.flight_id}</div>
                <div>Sex: {ticket.sex}</div>
            </div>
            <div className="pl-2 border border-gray-600 w-52 m-1 rounded-xl flex flex-col justify-center items-center">
                <div className="text-xl font-bold">{ticket.city}</div>
            </div>
            <div className="pl-2 border border-gray-600 w-52 m-1 rounded-xl flex flex-col justify-around">
                <div>First Name: {ticket.Fname}</div>
                <div>Last Name: {ticket.Lname}</div>
                <div>Phone: {ticket.phone}</div>
                <div>Age: {ticket.age}</div>
            </div>
            <div className="pl-2 border border-gray-600 w-52 m-1 rounded-xl flex flex-col justify-around">
                <div>Class: {ticket.class}</div>
                <div>Wifi: {ticket.wifi}</div>
                <div>Departure: {ticket.Departure}</div>
                <div>Return: {ticket.Return}</div>
            </div>
            <div className="pl-2 border border-gray-600 w-52 m-1 rounded-xl flex flex-col justify-around">
                <button className="bg-white text-gray-800 border-2 rounded-xl border-gray-800 p-1 transition ease-out hover:scale-105 hover:bg-gray-800 hover:text-white w-20" onClick={handleToggleLuggage}>
                    Luggage
                </button>
                {showLuggage && (
                    <div>
                        {luggageData.map((luggage) => (
                            <div key={luggage.id}>
                                <div>Number: {luggage.num}</div>
                                <div>Price: {`${luggage.price} ${"SAR"}`}</div>
                                <div>Weight: {`${luggage.weight} ${"Kg"}`}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex justify-end p-1">
                <button className="bg-white text-gray-800 border-2 rounded-xl border-gray-800 p-1 transition ease-out hover:scale-105 hover:bg-gray-800 hover:text-white w-16 mr-2" onClick={handleEdit}>
                    Edit
                </button>
                <button className="removeBtn bg-white text-gray-800 border-2 rounded-xl border-gray-800 p-1 transition ease-out hover:scale-105 hover:bg-gray-800 hover:text-white w-20" onClick={() => removeTicket(ticket.id)}>
                    Remove
                </button>
            </div>
            {isEditing && <EditTicketModal ticket={ticket} onClose={handleClose} />}
        </div>
    );
};

export default TicketCard;