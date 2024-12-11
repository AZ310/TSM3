import React, { useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';

const WaitlistPromotion = () => {
  const [waitlist, setWaitlist] = useState([]);

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const fetchWaitlist = async () => {
    // Fetch passengers with wait_listed set to true, including the related schedule_id
    const { data, error } = await supabase
      .from('passengers')
      .select('*, schedules(schedule_id)') // Fetch schedule_id from the schedules table
      .eq('wait_listed', true);

    if (error) {
      console.error('Fetch Error:', error);
    } else {
      console.log('Fetched data:', data);  // Log the data to check the structure
      setWaitlist(data || []);
    }
  };

  const promotePassenger = async (passenger_id) => {
    // Update wait_listed to false for the given passenger_id
    const { error } = await supabase
      .from('passengers')
      .update({ wait_listed: false })
      .eq('passenger_id', passenger_id);

    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      alert('Passenger promoted successfully!');
      fetchWaitlist(); // Refresh the list after promotion
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Promote Waitlisted Passengers</h2>
      <table className="table-auto w-full border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2">Passenger ID</th>
            <th className="px-4 py-2">Schedule ID</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {waitlist.length > 0 ? (
            waitlist.map((passenger) => (
              <tr key={passenger.passenger_id}>
                <td className="border px-4 py-2">{passenger.passenger_id}</td>
                <td className="border px-4 py-2">
                  {}
                  {passenger.schedules ? passenger.schedules.schedule_id : 'No schedule'} 
                </td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => promotePassenger(passenger.passenger_id)}
                  >
                    Promote
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-4">
                No waitlisted passengers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WaitlistPromotion;
