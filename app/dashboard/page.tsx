import React from 'react';
import UrlList from '../../components/UrlList';
import UrlForm from '../../components/UrlForm';

const DashboardPage = () => {
    return (
        <div>
            <h1>Dashboard</h1>
            <UrlForm />
            <UrlList />
        </div>
    );
};

export default DashboardPage;