import React from 'react'
import summary from "../../images/summary.png";
import "../../css/Home.css";
import dashboardPageHeader from "../../images/dashboard-page-header-image.png";

export default function Home() {
  return (
    <div>
      <div className="page-header">
        <div className="page-header-image">
          <img src={dashboardPageHeader} alt="dashboard-page-header" className='page-header-icon' />
        </div>
        <div className="page-header-title">Dashboard</div>
      </div>


      <img src={summary} style={{width: "900px"}}/>
    </div>
  )
}
