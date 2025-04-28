import React from 'react';
import NotificationList from '../components/services/NotificationList.jsx';
import EmailToggle from '../components/ui/EmailToggle.jsx';

const Dashboard = () => {
  const userId = 1;

  return (
    <div>
      <h2>Panel de Usuario</h2>
      <EmailToggle userId={userId} />
      <NotificationList userId={userId} />
    </div>
  );
};

export default Dashboard;
