import React, { useState } from "react";

function ProductSalesTable({ productData }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(productData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h2 style={{ color: "#666", marginBottom: "20px" }}>Ürün Bazlı Satış Tablosu</h2>
      {productData.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th style={{
                  border: "1px solid #dee2e6",
                  padding: "12px",
                  textAlign: "left",
                  fontWeight: "600"
                }}>Ürün</th>
                <th style={{
                  border: "1px solid #dee2e6",
                  padding: "12px",
                  textAlign: "right",
                  fontWeight: "600"
                }}>Toplam Satış Adedi</th>
                <th style={{
                  border: "1px solid #dee2e6",
                  padding: "12px",
                  textAlign: "right",
                  fontWeight: "600"
                }}>Toplam Gelir (₺)</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((p, idx) => (
                <tr key={idx} style={{
                  backgroundColor: idx % 2 === 0 ? "#fff" : "#f8f9fa"
                }}>
                  <td style={{
                    border: "1px solid #dee2e6",
                    padding: "12px"
                  }}>{p.productName}</td>
                  <td style={{
                    border: "1px solid #dee2e6",
                    padding: "12px",
                    textAlign: "right"
                  }}>{p.totalQuantity.toLocaleString('tr-TR')}</td>
                  <td style={{
                    border: "1px solid #dee2e6",
                    padding: "12px",
                    textAlign: "right",
                    fontWeight: "600"
                  }}>₺{p.totalRevenue.toLocaleString('tr-TR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            {[...Array(totalPages).keys()].map((number) => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                style={{
                  padding: "8px 15px",
                  margin: "0 5px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: currentPage === number + 1 ? "#007bff" : "#f8f9fa",
                  color: currentPage === number + 1 ? "#fff" : "#007bff",
                  cursor: "pointer"
                }}
              >
                {number + 1}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "#666" }}>Ürün verisi bulunamadı.</p>
      )}
    </div>
  );
}

export default ProductSalesTable;

