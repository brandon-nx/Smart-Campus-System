import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../UI/Button'; // Assuming there's a Button component

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <Button onClick={() => navigate('/create-event')}>Create Event</Button>
            <Button onClick={() => navigate('/add-room')}>Add Room</Button>
            <Button onClick={() => navigate('/manage-users')}>Manage Users</Button>
        </div>
    );
};

export default AdminDashboard;
