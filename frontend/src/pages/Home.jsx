import React from 'react';
import useLoadData from '../hooks/useLoadData';
import FullScreenLoader from '../components/shared/FullScreenLoader';
import Auth from './Auth';

const Home = () => {
  const isLoading = useLoadData();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <Auth />
    </div>
  );
}
export default Home;