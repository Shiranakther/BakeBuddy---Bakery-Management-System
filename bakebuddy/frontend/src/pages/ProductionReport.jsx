
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import productionHeader from "../../images/production-page-header-image.png";
// import toast, { Toaster } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import "../../css/productionReport.css";
// import addButton from "../../images/add_button.png";

// export default function ProductionReport() {
//   const [productions, setProductions] = useState([]);
//   const [formData, setFormData] = useState({
//     productCode: "",
//     productName: "",
//     date: "",
//     quantity: "",
//     remarks: "",
//   });
//   const [editingId, setEditingId] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchProductions();
//   }, []);

//   const fetchProductions = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/production");
//       setProductions(response.data);
//       console.log(response.data);
//     } catch (error) {
//       console.error("Error fetching data", error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value,
//         lastUpdated: new Date().toLocaleString(), // Automatically update the last updated timestamp
//      });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingId) {
//         await axios.put(`http://localhost:5000/api/production/${editingId}`, formData);
//         toast.success("Production updated successfully!");
//       } else {
//         await axios.post("http://localhost:5000/api/production", formData);
//         toast.success("Production added successfully!");
//       }
//       fetchProductions();
//       setShowModal(false); // Close modal after update
//       setEditingId(null);
//       setFormData({ productCode: "", productName: "", date: "", quantity: "", remarks: "" });
//     } catch (error) {
//       toast.error("Error updating production.");
//     }
//   };

//   const handleEdit = (prod) => {
//     setFormData({
//       productCode: prod.productCode,
//       productName: prod.productName,
//       date: prod.date ? prod.date.split("T")[0] : "",
//       quantity: prod.quantity,
//       remarks: prod.remarks,
//       lastUpdated: prod.updatedAt ? new Date(prod.updatedAt).toLocaleString() : "Not Updated",
//     });
//     setEditingId(prod._id);
//     setShowModal(true);
//   };

//   return (
//     <>
//       <Toaster />
//       <div className="page-header">
//         <div className="page-header-image">
//           <img src={productionHeader} alt="dashboard-page-header" className="page-header-icon" />
//         </div>
//         <div className="page-header-title">Production Report</div>
//       </div>

//       <div className="production-table-wrapper">
//         <table className="production-table">
//           <thead>
//             <tr>
//               <th>Product Code</th>
//               <th>Product Name</th>
//               <th>Production Date</th>
//               <th>Quantity</th>
//               <th>Remarks</th>
//               <th>Last Update</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {productions.length === 0 ? (
//               <tr>
//                 <td colSpan="7" style={{ textAlign: "center" }}>No productions found</td>
//               </tr>
//             ) : (
//               productions.map((prod) => (
//                 <tr key={prod._id}>
//                   <td>{prod.productCode}</td>
//                   <td>{prod.productName}</td>
//                   <td>{prod.date ? prod.date.split("T")[0] : "N/A"}</td>
//                   <td>{prod.quantity}</td>
//                   <td>{prod.remarks}</td>
//                   <td>{prod.updatedAt ? new Date(prod.updatedAt).toLocaleString() : "N/A"}</td>
//                   <td>
//                     <div className="action-buttons">
//                       <button onClick={() => handleEdit(prod)} className="edit-btn">Edit</button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal for Adding/Editing Production */}
//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <div className="modal-header">
//               <h2>{editingId ? "Edit Production" : "Add Production"}</h2>
//               <button className="close-button" onClick={() => setShowModal(false)}>×</button>
//             </div>

//             <form onSubmit={handleSubmit} className="production-form">
//               <div className="production-details-wrapper-container">
//                 <div className="production-details-wrapper">
//                   <label>Product Code</label>
//                   <input
//                     type="text"
//                     name="productCode"
//                     placeholder="Product Code"
//                     value={formData.productCode}
//                     onChange={handleChange}
//                     className="production-details"
//                     readOnly
//                   />
//                 </div>
                
//                 <div className="production-details-wrapper">
//                   <label>Product Name</label>
//                   <input
//                     type="text"
//                     name="productName"
//                     placeholder="Product Name"
//                     value={formData.productName}
//                     onChange={handleChange}
//                     className="production-details"
//                     readOnly
                    
//                   />
//                 </div>

//                 <div className="production-details-wrapper">
//                   <label>Quantity</label>
//                   <input
//                     type="number"
//                     name="quantity"
//                     placeholder="Production Quantity"
//                     value={formData.quantity}
//                     onChange={handleChange}
//                     className="production-details"
//                     required
//                   />
//                 </div>
                
//               </div>

//               <div className="production-details-wrapper-container">
//                 <div className="production-details-wrapper">
//                   <label>Production Date</label>
//                   <input
//                     type="date"
//                     name="date"
//                     value={formData.date}
//                     onChange={handleChange}
//                     className="production-details"
//                     disabled={editingId !== null}
//                   />
//                 </div>

//                 <div className="production-details-wrapper">
//                 <label>Last Updated Date</label>
//                         <input
//                             type="text"
//                             name="lastUpdated"
//                             value={formData.lastUpdated || "Not Updated"}
//                             className="production-details"
//                             readOnly
//                         />
//                 </div>


//                 <div className="production-details-wrapper">
//                   <label>Remarks</label>
//                   <input
//                     type="text"
//                     name="remarks"
//                     placeholder="Remarks"
//                     value={formData.remarks}
//                     onChange={handleChange}
//                     className="production-details"
//                   />
//                 </div>
//               </div>

//               <div className="production-details-wrapper-container">
//                 <div className="production-details-wrapper">
//                   <button type="submit" className={`production-button ${editingId ? "update-mode" : "add-mode"}`}>
//                     {editingId ? "Update" : "Add"} Production
//                     <img src={addButton} alt="add-icon" />
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


import React, { useState, useEffect } from "react";
import axios from "axios";
import productionHeader from "../../images/production-page-header-image.png";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../../css/productionReport.css";
import addButton from "../../images/add_button.png";

export default function ProductionReport() {
  const [productions, setProductions] = useState([]);
  const [filteredProductions, setFilteredProductions] = useState([]);
  const [formData, setFormData] = useState({
    productCode: "",
    productName: "",
    date: "",
    quantity: "",
    remarks: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState(""); // Start date for filtering
  const [endDate, setEndDate] = useState(""); // End date for filtering
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductions();
  }, []);

  useEffect(() => {
    
    // Filter productions based on the date range when either start or end date changes
    if (startDate && endDate) {
        
      const filteredData = productions.filter((prod) => {
        const prodDate = new Date(prod.date);
        return prodDate >= new Date(startDate) && prodDate <= new Date(endDate);
      });
      setFilteredProductions(filteredData);
    } else {
      setFilteredProductions(productions);
    }
  }, [startDate, endDate, productions]);

  const fetchProductions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/production");
      setProductions(response.data);
      setFilteredProductions(response.data); // Set initial filtered productions
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value, lastUpdated: new Date().toLocaleString() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/production/${editingId}`, formData);
        toast.success("Production updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/production", formData);
        toast.success("Production added successfully!");
      }
      fetchProductions();
      setShowModal(false); // Close modal after update
      setEditingId(null);
      setFormData({ productCode: "", productName: "", date: "", quantity: "", remarks: "" });
    } catch (error) {
      toast.error("Error updating production.");
    }
  };

  const handleEdit = (prod) => {
    setFormData({
      productCode: prod.productCode,
      productName: prod.productName,
      date: prod.date ? prod.date.split("T")[0] : "",
      quantity: prod.quantity,
      remarks: prod.remarks,
      lastUpdated: prod.updatedAt ? new Date(prod.updatedAt).toLocaleString() : "Not Updated",
    });
    setEditingId(prod._id);
    setShowModal(true);
  };

 

  return (
    <>
      <Toaster />
      <div className="page-header">
        <div className="page-header-image">
          <img src={productionHeader} alt="dashboard-page-header" className="page-header-icon" />
        </div>
        <div className="page-header-title">Production Report</div>
      </div>

      <div className="date-range-filter">
        <label>Date From</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="date-input"
        />
        <label>Date To</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="date-input"
        />
      </div>

      <div className="production-table-wrapper">
        <table className="production-table">
          <thead>
            <tr>
              <th>Product Code</th>
              <th>Product Name</th>
              <th>Production Date</th>
              <th>Quantity</th>
              <th>Remarks</th>
              <th>Last Update</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProductions.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>No productions found</td>
              </tr>
            ) : (
              filteredProductions.map((prod) => (
                <tr key={prod._id}>
                  <td>{prod.productCode}</td>
                  <td>{prod.productName}</td>
                  <td>{prod.date ? prod.date.split("T")[0] : "N/A"}</td>
                  <td>{prod.quantity}</td>
                  <td>{prod.remarks}</td>
                  <td>{prod.updatedAt ? new Date(prod.updatedAt).toLocaleString() : "N/A"}</td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleEdit(prod)} className="edit-btn">Edit</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding/Editing Production */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingId ? "Edit Production" : "Add Production"}</h2>
              <button className="close-button" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="production-form">
              <div className="production-details-wrapper-container">
                <div className="production-details-wrapper">
                  <label>Product Code</label>
                  <input
                    type="text"
                    name="productCode"
                    placeholder="Product Code"
                    value={formData.productCode}
                    onChange={handleChange}
                    className="production-details"
                    readOnly
                  />
                </div>
                
                <div className="production-details-wrapper">
                  <label>Product Name</label>
                  <input
                    type="text"
                    name="productName"
                    placeholder="Product Name"
                    value={formData.productName}
                    onChange={handleChange}
                    className="production-details"
                    readOnly
                  />
                </div>

                <div className="production-details-wrapper">
                  <label>Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Production Quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="production-details"
                    required
                  />
                </div>
                
              </div>

              <div className="production-details-wrapper-container">
                <div className="production-details-wrapper">
                  <label>Production Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="production-details"
                    disabled={editingId !== null}
                  />
                </div>

                <div className="production-details-wrapper">
                  <label>Last Updated Date</label>
                  <input
                    type="text"
                    name="lastUpdated"
                    value={formData.lastUpdated || "Not Updated"}
                    className="production-details"
                    readOnly
                  />
                </div>

                <div className="production-details-wrapper">
                  <label>Remarks</label>
                  <input
                    type="text"
                    name="remarks"
                    placeholder="Remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    className="production-details"
                  />
                </div>
              </div>

              <div className="production-details-wrapper-container">
                <div className="production-details-wrapper">
                  <button type="submit" className={`production-button ${editingId ? "update-mode" : "add-mode"}`}>
                    {editingId ? "Update" : "Add"} Production
                    <img src={addButton} alt="add-icon" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
