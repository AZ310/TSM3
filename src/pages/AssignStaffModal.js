import React, { useState } from 'react';
import supabase from '../config/supabaseClient';

export const AssignStaffModal = () => {
  const [trainId, setTrainId] = useState('');
  const [staffId, setStaffId] = useState('');
  const [date, setDate] = useState(''); // Match with the database 'date'
  const [departureTime, setDepartureTime] = useState(''); // Match with the database 'departure_time'
  const [arrivalTime, setArrivalTime] = useState(''); // Match with the database 'arrival_time'
  const [originStation, setOriginStation] = useState(''); // New field for origin station
  const [destinationStation, setDestinationStation] = useState(''); // New field for destination station

  const handleAssign = async () => {
    // Insert the schedule record with all required fields
    const { error } = await supabase.from('schedules').insert({
      train_id: trainId,             // train_id from the database
      staff_id: staffId,             // staff_id from the database
      date: date,                    // date from the database
      departure_time: departureTime, // departure_time from the database
      arrival_time: arrivalTime,     // arrival_time from the database
      origin_station: originStation, // origin_station from the database
      destination_station: destinationStation, // destination_station from the database
    });

    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      alert('Scheduale assigned successfully!');
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Assign Scheduale</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Train ID"
          value={trainId}
          onChange={(e) => setTrainId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Staff ID"
          value={staffId}
          onChange={(e) => setStaffId(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)} // Use 'date' field
        />
        <input
          type="time"
          value={departureTime}
          onChange={(e) => setDepartureTime(e.target.value)} // Use 'departure_time' field
        />
        <input
          type="time"
          value={arrivalTime}
          onChange={(e) => setArrivalTime(e.target.value)} // Use 'arrival_time' field
        />
        <input
          type="text"
          placeholder="Origin Station"
          value={originStation}
          onChange={(e) => setOriginStation(e.target.value)} // New 'origin_station' field
        />
        <input
          type="text"
          placeholder="Destination Station"
          value={destinationStation}
          onChange={(e) => setDestinationStation(e.target.value)} // New 'destination_station' field
        />
        <button type="button" onClick={handleAssign}>
          Assign
        </button>
      </form>
    </div>
  );
};

export default AssignStaffModal;
