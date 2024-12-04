import React, { useState } from 'react';
import supabase from '../config/supabaseClient';

const EditTicketModal = ({ ticket, onSave, onClose }) => {
    const [formData, setFormData] = useState({ ...ticket });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Update ticket in the database
            const { error } = await supabase
                .from('ticket')
                .update(formData)
                .match({ id: ticket.id });

            if (error) {
                throw error;
            }

            // Close the modal
            onClose();
        } catch (error) {
            console.error('Error updating ticket:', error.message);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Edit Ticket</h2>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="flight_id" className="text-gray-600 mb-2">Flight ID</label>
                        <input type="text" id="flight_id" name="flight_id" value={formData.flight_id} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2" />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="sex" className="text-gray-600 mb-2">Sex</label>
                        <input type="text" id="sex" name="sex" value={formData.sex} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2" />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="phone" className="text-gray-600 mb-2">Phone</label>
                        <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2" />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="Fname" className="text-gray-600 mb-2">First Name</label>
                        <input type="text" id="Fname" name="Fname" value={formData.Fname} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2" />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="Lname" className="text-gray-600 mb-2">Last Name</label>
                        <input type="text" id="Lname" name="Lname" value={formData.Lname} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2" />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="class" className="text-gray-600 mb-2">Class</label>
                        <input type="text" id="class" name="class" value={formData.class} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2" />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="wifi" className="text-gray-600 mb-2">Wifi</label>
                        <input type="text" id="wifi" name="wifi" value={formData.wifi} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2" />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="Departure" className="text-gray-600 mb-2">Departure</label>
                        <input type="text" id="Departure" name="Departure" value={formData.Departure} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2" />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="Return" className="text-gray-600 mb-2">Return</label>
                        <input type="text" id="Return" name="Return" value={formData.Return} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2" />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="city" className="text-gray-600 mb-2">City</label>
                        <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2" />
                    </div>
                    <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" type="submit">Save</button>
                </form>
            </div>
        </div>
    );    
};

export default EditTicketModal;
