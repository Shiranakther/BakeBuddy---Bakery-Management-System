import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // For decoding JWT
import toast, { Toaster } from 'react-hot-toast'; // For toast notifications
import { jsPDF } from 'jspdf'; // For PDF generation
import 'jspdf-autotable'; // For PDF table formatting
import '../../css/items.css';
import itemHeader from '../../images/item-header-image.png';

export default function Items() {
  const [items, setItems] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [tags, setTags] = useState([]);
  const [userRole, setUserRole] = useState(null); // Store user role
  const [showReportOptions, setShowReportOptions] = useState(false); // For report options dropdown
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log('Fetching items from /api/item/all');
        const response = await axios.get('http://localhost:5000/api/item/all', {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token
          },
        });
        console.log('Fetched data:', response.data);
        setItems(response.data);
        setDisplayedItems(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        const errorMessage = err.response
          ? `Failed to fetch items: ${err.response.status} ${err.response.statusText} - ${err.response.data.message}`
          : err.message;
        setError(errorMessage);
        setLoading(false);
      }
    };

    const fetchUserRole = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token); // Decode JWT to get role
          setUserRole(decoded.role || 'supervisor'); // Default to supervisor if role missing
        } catch (err) {
          console.error('Token decode error:', err);
          setUserRole('supervisor'); // Fallback to supervisor on error
        }
      } else {
        setUserRole('supervisor'); // Default if no token
      }
    };

    fetchItems();
    fetchUserRole();
  }, []);

  const handleAddTag = () => {
    if (searchTerm && !tags.some(tag => tag.value === searchTerm && tag.filterType === filterType)) {
      const newTag = { value: searchTerm, filterType };
      const updatedTags = [...tags, newTag];
      setTags(updatedTags);
      setSearchTerm('');
      handleSearch(updatedTags);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = tags.filter(tag =>
      !(tag.value === tagToRemove.value && tag.filterType === tagToRemove.filterType)
    );
    setTags(updatedTags);
    handleSearch(updatedTags);
  };

  const handleSearch = (currentTags) => {
    console.log('Searching with tags:', currentTags);
    const filteredItems = items.filter(item => {
      if (currentTags.length === 0) return true;

      console.log('Processing item:', item);
      const matchesTags = currentTags.some(tag => {
        const tagLower = tag.value.toLowerCase();
        const tagFilterType = tag.filterType;

        switch (tagFilterType) {
          case 'Category':
            return (
              item.Category?.toLowerCase().includes(tagLower) ||
              item.category?.toLowerCase().includes(tagLower)
            );
          case 'ItemId':
            return (
              String(item.itemId).includes(tagLower) ||
              String(item.itemID).includes(tagLower)
            );
          case 'ItemName':
            return (
              item.name.toLowerCase().includes(tagLower) ||
              item.Name?.toLowerCase().includes(tagLower)
            );
          case 'IngredientId':
            return item.ingredients?.some(ing =>
              String(ing.ingredientId).includes(tagLower) ||
              String(ing.ingredientID).includes(tagLower)
            );
          case 'Ingredients':
            return item.ingredients?.some(ing =>
              ing.name.toLowerCase().includes(tagLower)
            );
          default: // 'All'
            return (
              (item.Category?.toLowerCase().includes(tagLower) ||
               item.category?.toLowerCase().includes(tagLower)) ||
              (String(item.itemId).includes(tagLower) ||
               String(item.itemID).includes(tagLower)) ||
              (item.name.toLowerCase().includes(tagLower) ||
               item.Name?.toLowerCase().includes(tagLower)) ||
              item.ingredients?.some(ing =>
                (String(ing.ingredientId).includes(tagLower) ||
                 String(ing.ingredientID).includes(tagLower)) ||
                ing.name.toLowerCase().includes(tagLower)
              )
            );
        }
      });
      return matchesTags;
    });
    console.log('Filtered items:', filteredItems);
    setDisplayedItems(filteredItems);
  };

  const handleDelete = async (itemId) => {
    if (userRole !== 'admin') {
      toast.error('Only Admins can delete items.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete item with ID ${itemId}?`)) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/item/${itemId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token
        },
      });

      const updatedItems = items.filter(item => item.itemId !== itemId);
      const deletedItem = items.find(item => item.itemId === itemId);
      setItems(updatedItems);
      setDisplayedItems(updatedItems);
      setError(null);
      toast.success(`Item "${deletedItem.name}" (ID: ${itemId}) deleted successfully!`);
    } catch (err) {
      console.error('Delete error:', err);
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      toast.error("Error deleting item");
    }
  };

  const handleEdit = (itemId) => {
    navigate(`/update-item/${itemId}`);
  };

  // Generate report data with nested structure
  const generateReportData = () => {
    const reportData = [];
    displayedItems.forEach(item => {
      if (item.ingredients?.length > 0) {
        item.ingredients.forEach((ing, index) => {
          const row = [
            index === 0 ? item.itemId : '', // Only show Item ID on the first row
            index === 0 ? item.name : '', // Only show Item Name on the first row
            index === 0 ? (item.Category || item.category || 'N/A') : '', // Only show Category on the first row
            ing.ingredientId,
            ing.name,
            ing.volume || 'N/A',
            ing.unit || 'N/A',
          ];
          reportData.push(row);
        });
      } else {
        reportData.push([
          item.itemId,
          item.name,
          item.Category || item.category || 'N/A',
          'N/A',
          'No ingredients',
          'N/A',
          'N/A',
        ]);
      }
    });
    return reportData;
  };

  // Generate CSV Report
  const generateCSVReport = () => {
    const header = [
      "Bakery Inc.",
      "Items Report",
      `Generated on: ${new Date().toLocaleString()}`,
      "Contact: info@bakery.com | +123 456 789",
      "",
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      header.join("\n") +
      "\n\n" +
      [
        ["Item ID", "Item Name", "Category", "Ingredient ID", "Ingredient Name", "Volume", "Unit"].join(",")
      ]
        .concat(generateReportData().map(row => row.map(cell => `"${cell}"`).join(","))) // Wrap cells in quotes
        .join("\n");

    const footer = [
      "",
      `Total Records: ${displayedItems.length}`,
      `Report Generated on: ${new Date().toLocaleString()}`,
    ];

    const finalCsvContent = csvContent + "\n\n" + footer.join("\n");

    const encodedUri = encodeURI(finalCsvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "items_report.csv");
    document.body.appendChild(link);
    link.click();
    setShowReportOptions(false);
  };

  // Generate PDF Report
  const generatePDFReport = () => {
    const doc = new jsPDF();

    // HEADER
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Bakery Inc.", 14, 10);
    doc.setFontSize(12);
    doc.text("Items Report", 14, 16);
    doc.setFontSize(10);
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 22);
    doc.text("Contact: info@bakery.com | +123 456 789", 14, 28);

    // TABLE
    doc.autoTable({
      head: [["Item ID", "Item Name", "Category", "Ingredient ID", "Ingredient Name", "Volume", "Unit"]],
      body: generateReportData(),
      startY: 40,
      margin: { top: 20 },
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [245, 166, 35], textColor: [255, 255, 255] }, // Orange header
      columnStyles: {
        0: { cellWidth: 20 }, // Item ID
        1: { cellWidth: 30 }, // Item Name
        2: { cellWidth: 25 }, // Category
        3: { cellWidth: 25 }, // Ingredient ID
        4: { cellWidth: 30 }, // Ingredient Name
        5: { cellWidth: 15 }, // Volume
        6: { cellWidth: 15 }, // Unit
      },
      didParseCell: (data) => {
        // Merge cells for Item ID, Item Name, and Category
        if (data.section === 'body') {
          const rowIndex = data.row.index;
          const colIndex = data.column.index;
          const currentRow = data.row.raw;

          if (colIndex === 0 || colIndex === 1 || colIndex === 2) {
            let rowspan = 1;
            let currentItemId = currentRow[0];
            if (currentItemId) {
              for (let i = rowIndex; i < data.table.body.length; i++) {
                if (data.table.body[i][0] === currentItemId && i !== rowIndex) {
                  rowspan++;
                } else if (i !== rowIndex) {
                  break;
                }
              }
              data.cell.styles.rowSpan = rowspan;
            }
          }
        }
      },
    });

    // FOOTER
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Page ${i} of ${pageCount}`, 14, doc.internal.pageSize.height - 10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, doc.internal.pageSize.height - 4);
      doc.text(`Total Records: ${displayedItems.length}`, doc.internal.pageSize.width - 50, doc.internal.pageSize.height - 4, { align: 'right' });
    }

    doc.save("items_report.pdf");
    setShowReportOptions(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const isSupervisor = userRole === 'supervisor';

  return (
    <>
      <div className="page-header">
        <div className="page-header-image">
          <img src={itemHeader} alt="item-page-header" className="page-header-icon" />
        </div>
        <div className="page-header-title">Items</div>
      </div>
      <div className="items-container">
        <div className="items-table-container">
          <div className="items-header-container">
            <h1 className="items-header">Item Management</h1>
          </div>

          <div className="items-table-header">
            <div className="search-container">
              <select
                className="filter-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Category">Category</option>
                <option value="ItemId">Item ID</option>
                <option value="ItemName">Item Name</option>
                <option value="IngredientId">Ingredient ID</option>
                <option value="Ingredients">Ingredients</option>
              </select>
              <input
                type="text"
                placeholder="Search"
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="search-button" onClick={handleAddTag}>
                Search
              </button>
            </div>
            <div className="add-button-container">
              <div className="report-button-container">
                <button
                  className="generate-report-button"
                  onClick={() => setShowReportOptions(!showReportOptions)}
                >
                  Generate Report
                </button>
                {showReportOptions && (
                  <div className="report-options">
                    <button className="report-option-button" onClick={generatePDFReport}>
                      PDF
                    </button>
                    <button className="report-option-button" onClick={generateCSVReport}>
                      CSV
                    </button>
                  </div>
                )}
              </div>
              <button className="add-button" onClick={() => navigate('/add-item')}>
                Add +
              </button>
            </div>
          </div>

          <div className="tags-container">
            {tags.map(tag => (
              <span key={`${tag.value}-${tag.filterType}`} className="tag">
                {`${tag.filterType}: ${tag.value}`}
                <button className="tag-close" onClick={() => handleRemoveTag(tag)}>
                  ✕
                </button>
              </span>
            ))}
          </div>

          <table className="items-table">
            <thead>
              <tr>
                <th>Item Id</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Ingredients Id</th>
                <th>Ingredients</th>
                <th>Volume</th>
                <th>Unit</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedItems.map((item) => (
                item.ingredients?.length > 0 ? (
                  item.ingredients.map((ing, index) => (
                    <tr key={`${item.itemId}-${index}`}>
                      {index === 0 && (
                        <>
                          <td rowSpan={item.ingredients.length}>{item.itemId}</td>
                          <td rowSpan={item.ingredients.length}>{item.name}</td>
                          <td rowSpan={item.ingredients.length}>{item.Category || item.category || 'N/A'}</td>
                        </>
                      )}
                      <td>{ing.ingredientId}</td>
                      <td>{ing.name}</td>
                      <td>{ing.volume || 'N/A'}</td>
                      <td>{ing.unit || 'N/A'}</td>
                      {index === 0 && (
                        <td rowSpan={item.ingredients.length}>
                          <div className="action-container">
                            <button
                              className="edit-button"
                              onClick={() => handleEdit(item.itemId)}
                            >
                              Edit
                            </button>
                            <button
                              className={`delete-button ${isSupervisor ? 'disabled' : ''}`}
                              onClick={() => handleDelete(item.itemId)}
                              disabled={isSupervisor}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr key={item.itemId}>
                    <td>{item.itemId}</td>
                    <td>{item.name}</td>
                    <td>{item.Category || item.category || 'N/A'}</td>
                    <td colSpan={4}>No ingredients</td>
                    <td>
                      <div className="action-container">
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(item.itemId)}
                        >
                          Edit
                        </button>
                        <button
                          className={`delete-button ${isSupervisor ? 'disabled' : ''}`}
                          onClick={() => handleDelete(item.itemId)}
                          disabled={isSupervisor}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Toaster />
    </>
  );
}