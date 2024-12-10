import React from 'react';
import { useLocation } from 'react-router-dom';

const TicketsPage = () => {
  const location = useLocation();
  const searchResults = location.state?.searchResults || [];

  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Available Tickets</h1>
      {searchResults.length > 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          {searchResults.map((ticket) => (
            <div key={ticket.schedule_id} className="border-b border-gray-200 py-4 last:border-b-0">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Train ID: {ticket.train_id}</p>
                  <p className="text-gray-600">
                    From: {ticket.origin_station} To: {ticket.destination_station}
                  </p>
                  <p>Departure: {ticket.departure_time}</p>
                  <p>Arrival: {ticket.arrival_time}</p>
                </div>
                <button className="bg-[#0057B8] text-white px-6 py-2 rounded hover:bg-[#004494] transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No tickets available for the selected destination.</p>
      )}
    </div>
  );
};

export default TicketsPage;
