import React from "react";
import { Link } from "react-router-dom";
import "../../css/AllReports.css";
import summary from "../../images/summary.png";


export default function AllReports() {
  return (
    <div className="reports-container">
      <div className="reports-title">Reports </div>
      <div className="reports-list">
        <Link to="/show-ingredient-report" className="report-link">Ingredient Report</Link>
        <Link to="/items" className="report-link">Item Report</Link>
        <Link to="/production-report" className="report-link">Production Report</Link>
        <Link to="/create-sales/repot" className="report-link">Sales Report</Link>
      </div>
        <img src={summary} style={{width: "900px",marginTop:"100PX"}}/>
    </div>
  );
}
