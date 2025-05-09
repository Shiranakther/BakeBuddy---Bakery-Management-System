import React from "react";
import { Link } from "react-router-dom";
import "../../css/AllReports.css";
import summary from "../../images/summary.png";
import { MdArrowForward } from "react-icons/md";
import report from "../../images/file.png";


export default function AllReports() {
  return (
    <>
    <div className="page-header">
                <div className="page-header-image">
                  <img src={report} alt="dashboard-page-header" className='page-header-icon' />
                </div>
                <div className="page-header-title">Reports</div>
              </div>
    <div className="reports-container">
      
      <div className="reports-list">
        <Link to="/show-ingredient-report" className="report-link">Ingredient Report
        <MdArrowForward className="arrow-icon" />
        </Link>
        
        <Link to="/items" className="report-link">Item Report
        <MdArrowForward className="arrow-icon" />
        </Link>
        <Link to="/production-report" className="report-link">Production Report
        <MdArrowForward className="arrow-icon" />
        </Link>
        <Link to="/create-sales/repot" className="report-link">Sales Report
        <MdArrowForward className="arrow-icon" />
        </Link>
      </div>
        
    </div>
    </>
    
  );
}
