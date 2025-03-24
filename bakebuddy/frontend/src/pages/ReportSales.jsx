import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Ensure this is imported correctly

const ReportSales = () => {
  const [salesData, setSalesData] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/sales/view");
      setSalesData(response.data);
      setFilteredSales(response.data); // Initialize filtered sales with all data
    } catch (error) {
      toast.error("Error fetching sales data");
    }
  };

  const handleSearch = () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    const filtered = salesData.filter((sale) => {
      const saleDate = new Date(sale.date).toISOString().split("T")[0];
      return saleDate >= startDate && saleDate <= endDate;
    });

    setFilteredSales(filtered);
  };

  const generateCSVReport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        ["Date", "Item Code", "Item Name", "Buyer Name", "Quantity"].join(",")
      ]
        .concat(
          filteredSales.map((sale) => [
            new Date(sale.date).toISOString().split("T")[0],
            sale.itemCode,
            sale.itemName,
            sale.buyerName,
            sale.salesQuentity,
          ].join(","))
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sales_report.csv");
    document.body.appendChild(link);
    link.click();
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();

    // HEADER: Adding company name, report title, and contact info
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Bakery Inc.", 14, 10);  // Company name
    doc.setFontSize(12);
    doc.text("Sales Report", 14, 16);  // Report title
    doc.setFontSize(10);
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 22);  // Generation date
    doc.text("Contact: info@bakery.com | +123 456 789", 14, 28);  // Contact info

    // Collecting data for the table
    const tableData = filteredSales.map((sale) => [
      new Date(sale.date).toISOString().split("T")[0],
      sale.itemCode,
      sale.itemName,
      sale.buyerName,
      sale.salesQuentity,
    ]);

    // Table content
    doc.autoTable({
      head: [["Date", "Item Code", "Item Name", "Buyer Name", "Quantity"]],
      body: tableData,
      startY: 40, // Adjust where the table starts
      margin: { top: 20 }, // Adjust the margin if needed
    });

    // FOOTER: Adding page number and date
    const pageCount = doc.internal.getNumberOfPages();
    const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
    const currentDate = new Date().toLocaleDateString();

    // Footer content with page numbers
    doc.setFontSize(8); // Smaller font for footer
    doc.text(`Page ${currentPage} of ${pageCount}`, 14, doc.internal.pageSize.height - 10);
    doc.text(`Generated on: ${currentDate}`, 14, doc.internal.pageSize.height - 4);

    // Save the generated PDF
    doc.save("sales_report.pdf");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Sales Report Generator</h2>
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{
            padding: "5px",
            marginRight: "20px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <label style={{ marginRight: "10px" }}>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{
            padding: "5px",
            marginRight: "20px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px",
            border: "none",
            backgroundColor: "#4CAF50",
            color: "white",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Search
        </button>
      </div>

      <table
        border="1"
        style={{
          marginTop: "20px",
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={{ padding: "10px", textAlign: "left" }}>Date</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Item Code</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Item Name</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Buyer Name</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map((sale) => (
            <tr key={sale._id}>
              <td style={{ padding: "8px" }}>{new Date(sale.date).toISOString().split("T")[0]}</td>
              <td style={{ padding: "8px" }}>{sale.itemCode}</td>
              <td style={{ padding: "8px" }}>{sale.itemName}</td>
              <td style={{ padding: "8px" }}>{sale.buyerName}</td>
              <td style={{ padding: "8px" }}>{sale.salesQuentity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={generateCSVReport}
          style={{
            padding: "10px 20px",
            border: "none",
            backgroundColor: "#4CAF50",
            color: "white",
            cursor: "pointer",
            borderRadius: "5px",
            marginRight: "10px",
          }}
        >
          Generate CSV Report
        </button>
        <button
          onClick={generatePDFReport}
          style={{
            padding: "10px 20px",
            border: "none",
            backgroundColor: "#008CBA",
            color: "white",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Generate PDF Report
        </button>
      </div>

      <Toaster />
    </div>
  );
};

export default ReportSales;
