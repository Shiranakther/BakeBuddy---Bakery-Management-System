import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const Unauthorized = () => {
  const [isToastVisible, setIsToastVisible] = useState(false);

  useEffect(() => {
    const toastId = toast.error("You do not have permission to access this page!", {
      duration: 5000, // Toast will be visible for 5 seconds
      style: {
        background: 'white', // Red background for error
        color: 'black',
        fontSize: '16px', // Font size
        padding: '16px', // Padding around the message
      },
      position: 'top-center', // Position of the toast
      reverseOrder: true, // Show newer toasts above
    });

    // Cleanup the toast if the component unmounts before it closes
    return () => {
      toast.dismiss(toastId);
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>403 - Access Denied</h1>
      <p>You do not have permission to view this page.</p>
      <Link to="/">Go Back to Home</Link>
      <Toaster position="top-center" reverseOrder={true} />    
    </div>
  );
};

export default Unauthorized;
