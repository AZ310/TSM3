import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  Settings, 
  Plus,
  Search,
  Train,
  UserCheck,
  List,
  Edit,
  Trash,
  AlertCircle,
  Loader,
  ArrowRight
} from 'lucide-react';
import supabase from '../config/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  // State Management
  const [activeTab, setActiveTab] = useState('schedules');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalPassengers: 0,
    activeTrains: 0,
    todayDepartures: 0,
    waitlistedCount: 0
  });

  // Seat Management State
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [scheduleSeats, setScheduleSeats] = useState([]);
  const [seatLoading, setSeatLoading] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [passengers, setPassengers] = useState([]);
  
  // Form Data State
  const [formData, setFormData] = useState({
    trainId: '',
    staffId: '',
    date: '',
    departureTime: '',
    arrivalTime: '',
    originStation: '',
    destinationStation: ''
  });

  const navigate = useNavigate();
  const { user } = useAuth();

  // Initial Data Fetch
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchSchedules(),
        fetchWaitlist(),
        fetchStats(),
        fetchPassengers()
      ]);
    } catch (error) {
      setError('Failed to load dashboard data');
      console.error('Dashboard loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedules = async () => {
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) throw error;
    setSchedules(data || []);
  };

// In AdminDashboard.js
const fetchWaitlist = async () => {
  const { data, error } = await supabase
    .from('waitlist')
    .select(`
      *,
      users (name, email),
      schedules (
        schedule_id,
        train_id,
        departure_time,
        origin_station,
        destination_station
      )
    `)
    .eq('status', 'waiting')
    .order('position', { ascending: true });

  if (error) throw error;
  setWaitlist(data || []);
};

const handlePromotePassenger = async (waitlistId, userId, scheduleId) => {
  try {
    // Start a transaction
    const { data: availableSeats } = await supabase
      .from('seats')
      .select('seat_number')
      .eq('schedule_id', scheduleId)
      .eq('is_occupied', false)
      .limit(1);

    if (availableSeats && availableSeats.length > 0) {
      // Assign the seat
      await supabase.from('seats').insert({
        schedule_id: scheduleId,
        passenger_id: userId,
        seat_number: availableSeats[0].seat_number,
        is_occupied: true
      });

      // Update waitlist status
      await supabase
        .from('waitlist')
        .update({ status: 'promoted' })
        .eq('waitlist_id', waitlistId);

      // Reorder remaining waitlist positions
      await supabase.rpc('update_waitlist_positions', { schedule_id: scheduleId });

      await fetchWaitlist();
    }
  } catch (error) {
    console.error('Error promoting passenger:', error);
    setError('Failed to promote passenger');
  }
};

  const fetchPassengers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'passenger');

    if (error) throw error;
    setPassengers(data || []);
  };

  const fetchStats = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    const { count: passengersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .eq('role', 'passenger');

    const { count: trainsCount } = await supabase
      .from('schedules')
      .select('*', { count: 'exact' })
      .gte('date', today);

    const { count: departuresCount } = await supabase
      .from('schedules')
      .select('*', { count: 'exact' })
      .eq('date', today);

    const { count: waitlistCount } = await supabase
      .from('passengers')
      .select('*', { count: 'exact' })
      .eq('wait_listed', true);

    setStats({
      totalPassengers: passengersCount || 0,
      activeTrains: trainsCount || 0,
      todayDepartures: departuresCount || 0,
      waitlistedCount: waitlistCount || 0
    });
  };

  const fetchScheduleSeats = async (scheduleId) => {
    setSeatLoading(true);
    try {
      const { data, error } = await supabase
        .from('seats')
        .select(`
          *,
          users:passenger_id (name, email)
        `)
        .eq('schedule_id', scheduleId);

      if (error) throw error;
      setScheduleSeats(data || []);
    } catch (error) {
      console.error('Error fetching seats:', error);
      setError('Failed to load seats');
    } finally {
      setSeatLoading(false);
    }
  };

  // Handle Actions
  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('schedules')
        .insert([{
          train_id: formData.trainId,
          staff_id: formData.staffId,
          date: formData.date,
          departure_time: formData.departureTime,
          arrival_time: formData.arrivalTime,
          origin_station: formData.originStation,
          destination_station: formData.destinationStation
        }]);

      if (error) throw error;
      
      await fetchSchedules();
      setShowAssignModal(false);
      setFormData({
        trainId: '',
        staffId: '',
        date: '',
        departureTime: '',
        arrivalTime: '',
        originStation: '',
        destinationStation: ''
      });
    } catch (error) {
      setError('Failed to create schedule');
      console.error('Schedule creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  // const handlePromotePassenger = async (passengerId) => {
  //   try {
  //     const { error } = await supabase
  //       .from('passengers')
  //       .update({ wait_listed: false })
  //       .eq('passenger_id', passengerId);

  //     if (error) throw error;
  //     await fetchWaitlist();
  //   } catch (error) {
  //     setError('Failed to promote passenger');
  //     console.error('Passenger promotion error:', error);
  //   }
  // };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;
    
    try {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('schedule_id', scheduleId);

      if (error) throw error;
      await fetchSchedules();
    } catch (error) {
      setError('Failed to delete schedule');
      console.error('Schedule deletion error:', error);
    }
  };

  const handleDeleteSeat = async (seatId) => {
    if (!window.confirm('Are you sure you want to delete this seat booking?')) return;
    
    try {
      const { error } = await supabase
        .from('seats')
        .delete()
        .eq('seat_id', seatId);

      if (error) throw error;
      await fetchScheduleSeats(selectedSchedule);
    } catch (error) {
      setError('Failed to delete seat booking');
      console.error('Seat deletion error:', error);
    }
  };

  const handleReassignSeat = async (seatId, newPassengerId) => {
    try {
      const { error } = await supabase
        .from('seats')
        .update({ passenger_id: newPassengerId })
        .eq('seat_id', seatId);

      if (error) throw error;
      await fetchScheduleSeats(selectedSchedule);
      setShowReassignModal(false);
      setSelectedSeat(null);
    } catch (error) {
      setError('Failed to reassign seat');
      console.error('Seat reassignment error:', error);
    }
  };

  if (loading && !schedules.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={() => setShowAssignModal(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>New Schedule</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Passengers</p>
                <p className="text-2xl font-semibold mt-1">{stats.totalPassengers}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Trains</p>
                <p className="text-2xl font-semibold mt-1">{stats.activeTrains}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-full">
                <Train className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Departures</p>
                <p className="text-2xl font-semibold mt-1">{stats.todayDepartures}</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Waitlisted</p>
                <p className="text-2xl font-semibold mt-1">{stats.waitlistedCount}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-full">
                <List className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('schedules')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'schedules'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Schedules
              </button>
              <button
                onClick={() => setActiveTab('waitlist')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'waitlist'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Waitlist
              </button>
              <button
                onClick={() => setActiveTab('seats')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'seats'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Seat Management
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'schedules' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Train ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {schedules.map((schedule) => (
                      <tr key={schedule.schedule_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{schedule.train_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{schedule.staff_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{schedule.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{schedule.departure_time}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{schedule.arrival_time}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {schedule.origin_station} → {schedule.destination_station}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteSchedule(schedule.schedule_id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            <Trash className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'waitlist' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passenger ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Train</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {waitlist.map((passenger) => (
                      <tr key={passenger.passenger_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{passenger.passenger_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {passenger.schedules?.schedule_id || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {passenger.schedules?.train_id || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {passenger.schedules?.departure_time || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handlePromotePassenger(passenger.passenger_id)}
                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-green-200 transition-colors"
                          >
                            Promote
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'seats' && (
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700">Select Schedule</label>
                  <select 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    onChange={(e) => {
                      setSelectedSchedule(e.target.value);
                      fetchScheduleSeats(e.target.value);
                    }}
                  >
                    <option value="">Select a schedule...</option>
                    {schedules.map(schedule => (
                      <option key={schedule.schedule_id} value={schedule.schedule_id}>
                        Train {schedule.train_id} - {schedule.departure_time} ({schedule.origin_station} → {schedule.destination_station})
                      </option>
                    ))}
                  </select>
                </div>

                {seatLoading ? (
                  <div className="text-center py-4">
                    <Loader className="w-6 h-6 animate-spin mx-auto text-blue-600" />
                  </div>
                ) : scheduleSeats.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seat Number</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Passenger</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking Reference</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {scheduleSeats.map(seat => (
                          <tr key={seat.seat_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">{seat.seat_number}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {seat.users?.name || 'Unassigned'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {seat.booking_reference}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    setSelectedSeat(seat);
                                    setShowReassignModal(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  Reassign
                                </button>
                                <button
                                  onClick={() => handleDeleteSeat(seat.seat_id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    No seats found for this schedule.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assign Schedule Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Create New Schedule</h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Train ID</label>
                <input
                  type="text"
                  value={formData.trainId}
                  onChange={(e) => setFormData({ ...formData, trainId: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Staff ID</label>
                <input
                  type="text"
                  value={formData.staffId}
                  onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Departure Time</label>
                  <input
                    type="time"
                    value={formData.departureTime}
                    onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Arrival Time</label>
                  <input
                    type="time"
                    value={formData.arrivalTime}
                    onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Origin Station</label>
                <input
                  type="text"
                  value={formData.originStation}
                  onChange={(e) => setFormData({ ...formData, originStation: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Destination Station</label>
                <input
                  type="text"
                  value={formData.destinationStation}
                  onChange={(e) => setFormData({ ...formData, destinationStation: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    'Create Schedule'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reassign Seat Modal */}
      {showReassignModal && selectedSeat && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Reassign Seat {selectedSeat.seat_number}</h3>
              <button
                onClick={() => {
                  setShowReassignModal(false);
                  setSelectedSeat(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Passenger</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">onChange={(e) => handleReassignSeat(selectedSeat.seat_id, e.target.value)}
                  
                    <option value="">Select a passenger...</option>
                    {passengers.map(passenger => (
                      <option key={passenger.id} value={passenger.id}>
                        {passenger.name} ({passenger.email})
                      </option>
                    ))}
                  </select>
                </div>
  
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReassignModal(false);
                      setSelectedSeat(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default AdminDashboard;
                  