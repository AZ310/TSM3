// AdminDashboard.js
import React from 'react';
import ManageReservations from './ManageReservations';
import AssignStaffModal from './AssignStaffModal';
import WaitlistPromotion from './WaitlistPromotion';

export const AdminDashboard = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <ManageReservations />
      <AssignStaffModal />
      <WaitlistPromotion />
    </div>
  );
};
export default AdminDashboard;