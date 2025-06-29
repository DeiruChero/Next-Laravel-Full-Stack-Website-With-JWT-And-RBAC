'use client';
import { useAuth } from '@/app/_context/AuthContext';

const UserInfo = () => {
  const { user } = useAuth();

  if (!user) return <p>Loading user...</p>;

  return (
    <div>
      <div className='row' style={{ paddingTop: '5rem'}}>
        <div className='card mx-auto mt-3 p-4 shadow-sm' >
          <h1 className='bg-warning text-center'>Hello, {user.name}</h1><br/>
          <p>Email: {user.email}</p>
          <button className='btn btn-outline-success'>success</button><br/>
          <button className='btn btn-success'>success</button><br/>
          <button className='bg-success text-white'>success</button><br/>
          <button>success</button>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;