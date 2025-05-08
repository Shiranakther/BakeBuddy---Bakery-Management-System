import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "../../css/sales/SalesReport.css"; // Keep existing CSS import
import salesHeader from "../../images/sales-page-header-image.png";

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
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/sales/view`);
      setSalesData(response.data);
      setFilteredSales(response.data);
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

  const handleClearSearch = () => {
    setStartDate("");
    setEndDate("");
    setFilteredSales(salesData);
  };

  const generateCSVReport = () => {
    const loadingToast = toast.loading("Generating CSV report..."); // Show loading toast
    try {
      const header = [
        "Bakery Inc.",
        "Sales Report",
        `Generated on: ${new Date().toLocaleString()}`,
        "Contact: info@bakery.com | +123 456 789",
        "",
      ];

      const csvContent =
        "data:text/csv;charset=utf-8," +
        header.join("\n") +
        "\n\n" +
        [["Date", "Item Code", "Item Name", "Buyer Name", "Quantity"].join(",")]
          .concat(
            filteredSales.map((sale) =>
              [
                new Date(sale.date).toISOString().split("T")[0],
                sale.itemCode,
                sale.itemName,
                sale.buyerName,
                sale.salesQuentity,
              ].join(",")
            )
          )
          .join("\n");

      const footer = [
        "",
        `Total Records: ${filteredSales.length}`,
        `Report Generated on: ${new Date().toLocaleString()}`,
      ];

      const finalCsvContent = csvContent + "\n\n" + footer.join("\n");

      const encodedUri = encodeURI(finalCsvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "sales_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up

      toast.success("CSV report generated successfully!", {
        id: loadingToast, // Replace loading toast with success
        duration: 2000,
      });
    } catch (error) {
      toast.error("Error generating CSV report", {
        id: loadingToast, // Replace loading toast with error
      });
      console.error("CSV generation error:", error);
    }
  };

  const generatePDFReport = () => {
    const loadingToast = toast.loading("Generating PDF report..."); // Show loading toast
    try {
      const doc = new jsPDF();

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Bakery Inc.", 14, 10);
      doc.setFontSize(12);
      doc.text("Sales Report", 14, 16);
      doc.setFontSize(10);
      doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 22);
      doc.text("Contact: info@bakery.com | +123 456 789", 14, 28);

      const tableData = filteredSales.map((sale) => [
        new Date(sale.date).toISOString().split("T")[0],
        sale.itemCode,
        sale.itemName,
        sale.buyerName,
        sale.salesQuentity,
      ]);

      doc.autoTable({
        head: [["Date", "Item Code", "Item Name", "Buyer Name", "Quantity"]],
        body: tableData,
        startY: 40,
        margin: { top: 20 },
      });

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${pageCount}`, 14, doc.internal.pageSize.height - 10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, doc.internal.pageSize.height - 4);
      }

      doc.save("sales_report.pdf");

      toast.success("PDF report generated successfully!", {
        id: loadingToast, // Replace loading toast with success
        duration: 2000,
      });
    } catch (error) {
      toast.error("Error generating PDF report", {
        id: loadingToast, // Replace loading toast with error
      });
      console.error("PDF generation error:", error);
    }
  };

  return (
    <>
    <div className="page-header">
            <div className="page-header-image">
              <img src={salesHeader} alt="dashboard-page-header" className='page-header-icon' />
            </div>
            <div className="page-header-title">Sales</div>
          </div>
    <div className="sales-report-main-container">
      <h2 className="sales-report-title">Sales Report Generator</h2>
      <div className="sales-report-search-container">
        <label className="sales-report-label">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="sales-report-input"
        />
        <label className="sales-report-label">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="sales-report-input"
        />
        <button onClick={handleSearch} className="sales-report-search-btn">
          Search
        </button>
        <button onClick={handleClearSearch} className="sales-report-clear-btn">
          Clear Search
        </button>
      </div>

      <table className="sales-report-table">
        <thead>
          <tr className="sales-report-table-header">
            <th className="sales-report-table-th">Date</th>
            <th className="sales-report-table-th">Item Code</th>
            <th className="sales-report-table-th">Item Name</th>
            <th className="sales-report-table-th">Buyer Name</th>
            <th className="sales-report-table-th">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map((sale) => (
            <tr key={sale._id} className="sales-report-table-row">
              <td className="sales-report-table-td">{new Date(sale.date).toISOString().split("T")[0]}</td>
              <td className="sales-report-table-td">{sale.itemCode}</td>
              <td className="sales-report-table-td">{sale.itemName}</td>
              <td className="sales-report-table-td">{sale.buyerName}</td>
              <td className="sales-report-table-td">{sale.salesQuentity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="sales-report-button-group">
        <button onClick={generateCSVReport} className="sales-report-csv-btn">
          Generate CSV Report
        </button>
        <button onClick={generatePDFReport} className="sales-report-pdf-btn">
          Generate PDF Report
        </button>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000, // Default duration
          style: {
            background: "#333",
            color: "#fff",
          },
          success: {
            style: {
              background: "#4CAF50",
            },
          },
          error: {
            style: {
              background: "#f44336",
            },
          },
        }}
      />
    </div>
    </>
  );
};

export default ReportSales;