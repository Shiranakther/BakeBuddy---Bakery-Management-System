import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "../../css/sales/SalesReport.css";
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
      const response = await axios.get("http://localhost:5000/api/sales/view");
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
    const loadingToast = toast.loading("Generating CSV report...");
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
      document.body.removeChild(link);

      toast.success("CSV report generated successfully!", {
        id: loadingToast,
        duration: 2000,
      });
    } catch (error) {
      toast.error("Error generating CSV report", {
        id: loadingToast,
      });
      console.error("CSV generation error:", error);
    }
  };

  const generatePDFReport = () => {
    const loadingToast = toast.loading("Generating PDF report...");
    try {
      const doc = new jsPDF();
      const margin = 15;
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      // === Header Background ===
      doc.setFillColor(255, 245, 235);
      doc.rect(0, 0, pageWidth, 40, "F");

      // === Header ===
      doc.setFont("helvetica", "bold");
      doc.setFontSize(30);
      const bakeryName = "Bakery Inc.";
      doc.setTextColor(51, 51, 51);
      const nameWidth = doc.getTextWidth(bakeryName);
      doc.text(bakeryName, (pageWidth - nameWidth) / 2, margin);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const address = "NO 302, Kandy Rd, Malabe";
      const contact = "info@bakery.com | +123 456 789";
      const addressWidth = doc.getTextWidth(address);
      const contactWidth = doc.getTextWidth(contact);
      doc.text(address, (pageWidth - addressWidth) / 2, margin + 7);
      doc.text(contact, (pageWidth - contactWidth) / 2, margin + 13);

      // === Report Title ===
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(217, 83, 79); // #d9534f
      const title = "Sales Report";
      const titleWidth = doc.getTextWidth(title);
      doc.text(title, (pageWidth - titleWidth) / 2, margin + 35);

      // === Border ===
      doc.setDrawColor(0);
      doc.rect(
        margin - 5,
        margin + 50,
        pageWidth - 2 * (margin - 5),
        pageHeight - margin * 2 - 45,
        "S"
      );

      // === Table ===
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
        startY: margin + 55,
        margin: { left: margin, right: margin },
        styles: {
          font: "helvetica",
          fontSize: 10,
          textColor: [0, 0, 0],
        },
        headStyles: {
          fillColor: [217, 83, 79], // #d9534f
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245], // Light grey
        },
        columnStyles: {
          0: { cellWidth: 30 }, // Date
          1: { cellWidth: 30 }, // Item Code
          2: { cellWidth: 50 }, // Item Name
          3: { cellWidth: 50 }, // Buyer Name
          4: { cellWidth: 20 }, // Quantity
        },
      });

      // === Footer ===
      const addFooter = () => {
        const now = new Date().toLocaleString();
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(now, margin, pageHeight - 10);
        const rightsText = "All rights reserved Bakery Inc.";
        const rightsWidth = doc.getTextWidth(rightsText);
        const centerX = (pageWidth - rightsWidth) / 2;
        doc.text(rightsText, centerX, pageHeight - 10);
        const pageCount = doc.internal.getNumberOfPages();
        doc.text(
          `Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`,
          pageWidth - margin - 30,
          pageHeight - 10
        );
      };

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        addFooter();
      }

      doc.save("sales_report.pdf");

      toast.success("PDF report generated successfully!", {
        id: loadingToast,
        duration: 2000,
      });
    } catch (error) {
      toast.error("Error generating PDF report", {
        id: loadingToast,
      });
      console.error("PDF generation error:", error);
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-image">
          <img
            src={salesHeader}
            alt="dashboard-page-header"
            className="page-header-icon"
          />
        </div>
        <div className="page-header-title">Sales Report</div>
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
                <td className="sales-report-table-td">
                  {new Date(sale.date).toISOString().split("T")[0]}
                </td>
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
            duration: 3000,
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