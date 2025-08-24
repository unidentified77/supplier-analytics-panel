import React, { useState } from "react";
import "./ProductSalesTable.css";

function ProductSalesTable({ productData }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(productData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="pst-card">
      <h2 className="pst-title">Ürün Bazlı Satış Tablosu</h2>
      {productData.length > 0 ? (
        <div className="pst-tableWrapper">
          <table className="pst-table">
            <thead>
              <tr>
                <th className="pst-th left">Ürün</th>
                <th className="pst-th right">Toplam Satış Adedi</th>
                <th className="pst-th right">Toplam Gelir (₺)</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((p, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "pst-row pst-row-even" : "pst-row pst-row-odd"}>
                  <td className="pst-td">{p.productName}</td>
                  <td className="pst-td right">{p.totalQuantity.toLocaleString('tr-TR')}</td>
                  <td className="pst-td right pst-revenue">₺{p.totalRevenue.toLocaleString('tr-TR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pst-pagination">
            {[...Array(totalPages).keys()].map((number) => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                className={`pst-pageBtn ${currentPage === number + 1 ? 'active' : ''}`}
                aria-label={`Sayfa ${number + 1}`}
              >
                {number + 1}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="pst-empty">Ürün verisi bulunamadı.</p>
      )}
    </div>
  );
}

export default ProductSalesTable;

