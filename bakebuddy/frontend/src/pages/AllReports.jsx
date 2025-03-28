import React from "react";
import { Link } from "react-router-dom";
import "../../css/AllReports.css";

export default function AllReports() {
  return (
    <div className="reports-container">
      <h1 className="reports-title">Reports Dashboard</h1>
      <div className="reports-list">
        <Link to="/show-ingredient-report" className="report-link">Ingredient Report</Link>
        <Link to="#" className="report-link">Item Report</Link>
        <Link to="/production-report" className="report-link">Production Report</Link>
        <Link to="/create-sales/repot" className="report-link">Sales Report</Link>
      </div>
    </div>
  );
}
