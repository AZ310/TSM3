import React, { useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';

export const ManageReservations = () => {
  const [schedules, setSchedules] = useState([]);
  const [editSchedule, setEditSchedule] = useState(null);

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Fetch all schedules from the database
  const fetchSchedules = async () => {
    const { data, error } = await supabase.from('schedules').select('*');
    if (error) {
      console.error(error);
    } else {
      setSchedules(data);
    }
  };

  // Handle editing a schedule
  const handleEdit = (schedule) => {
    setEditSchedule(schedule); // Set the schedule to be edited
  };

  // Handle updating a schedule
  const handleUpdate = async () => {
    const { error } = await supabase
      .from('schedules')
      .update({
        departure_time: editSchedule.departure_time,
        arrival_time: editSchedule.arrival_time,
        origin_station: editSchedule.origin_station,
        destination_station: editSchedule.destination_station,
        date: editSchedule.date, // Ensure we're updating the date as well
      })
      .eq('schedule_id', editSchedule.schedule_id); // Ensure we update the correct schedule

    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      alert('Schedule updated successfully!');
      setEditSchedule(null); // Close the edit form
      fetchSchedules(); // Refresh the schedule list
    }
  };

  // Handle deleting a schedule
  const handleDelete = async (scheduleId) => {
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('schedule_id', scheduleId);

    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      alert('Schedule deleted successfully!');
      fetchSchedules(); // Refresh the schedule list
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Manage Schedules</h2>
      
      {/* Display Edit Form if we are editing a schedule */}
      {editSchedule && (
        <div className="edit-form mb-8">
          <h3 className="text-xl font-semibold mb-4">Edit Schedule</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Train ID"
              value={editSchedule.train_id}
              onChange={(e) => setEditSchedule({ ...editSchedule, train_id: e.target.value })}
            />
            <input
              type="text"
              placeholder="Staff ID"
              value={editSchedule.staff_id}
              onChange={(e) => setEditSchedule({ ...editSchedule, staff_id: e.target.value })}
            />
            <input
              type="date"
              value={editSchedule.date}
              onChange={(e) => setEditSchedule({ ...editSchedule, date: e.target.value })}
            />
            <input
              type="time"
              value={editSchedule.departure_time}
              onChange={(e) => setEditSchedule({ ...editSchedule, departure_time: e.target.value })}
            />
            <input
              type="time"
              value={editSchedule.arrival_time}
              onChange={(e) => setEditSchedule({ ...editSchedule, arrival_time: e.target.value })}
            />
            <input
              type="text"
              placeholder="Origin Station"
              value={editSchedule.origin_station}
              onChange={(e) => setEditSchedule({ ...editSchedule, origin_station: e.target.value })}
            />
            <input
              type="text"
              placeholder="Destination Station"
              value={editSchedule.destination_station}
              onChange={(e) => setEditSchedule({ ...editSchedule, destination_station: e.target.value })}
            />
            <button type="button" onClick={handleUpdate}>
              Update Schedule
            </button>
            <button type="button" onClick={() => setEditSchedule(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Display Schedules in a Table */}
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>Train ID</th>
            <th>Staff ID</th>
            <th>Date</th>
            <th>Departure Time</th>
            <th>Arrival Time</th>
            <th>Origin Station</th>
            <th>Destination Station</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <tr key={schedule.schedule_id}>
              <td>{schedule.train_id}</td>
              <td>{schedule.staff_id}</td>
              <td>{schedule.date}</td>
              <td>{schedule.departure_time}</td>
              <td>{schedule.arrival_time}</td>
              <td>{schedule.origin_station}</td>
              <td>{schedule.destination_station}</td>
              <td>
                <button className="btn-edit" onClick={() => handleEdit(schedule)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(schedule.schedule_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageReservations;
