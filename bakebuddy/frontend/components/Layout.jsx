
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Slidebar from './Slidebar';

export default function Layout() {
  return (
    <div className="layout-container" style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
  
      <Header />
     
      <div style={{ display: "flex", flex: 1 }}>
        
        <div style={{ width: "300px", minHeight: "100vh", background: "#f4f4f4" ,borderTop:"1px solid #e0e0e0"}}>
          <Slidebar />
        </div>

       
        <main style={{ flex: 1, padding: "0", overflowY: "auto" ,marginTop:"60px"}}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
