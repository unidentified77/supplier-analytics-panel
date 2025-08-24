import React, { useState } from "react";
import "./ProductSalesTable.css";

function ProductSalesTable({ productData }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [customPage, setCustomPage] = useState("");
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.max(1, Math.ceil(productData.length / itemsPerPage));

  // clamp paginate to valid range
  const paginate = (pageNumber) => {
    const page = Math.max(1, Math.min(totalPages, Number(pageNumber) || 1));
    setCurrentPage(page);
    setCustomPage("");
  };

  // return up to 3 page numbers, centered around currentPage when possible
  const getVisiblePages = () => {
    if (totalPages <= 3) {
      return [...Array(totalPages).keys()].map((i) => i + 1);
    }
    let start = currentPage - 1; // try to show current in middle
    if (start < 1) start = 1;
    if (start + 2 > totalPages) start = totalPages - 2;
    return [start, start + 1, start + 2];
  };

  const handleCustomChange = (e) => {
    // allow only numbers and empty string
    const val = e.target.value;
    if (val === "" || /^\d+$/.test(val)) {
      setCustomPage(val);
    }
  };

  const handleCustomKey = (e) => {
    if (e.key === "Enter") {
      const num = Number(customPage);
      if (num >= 1 && num <= totalPages) paginate(num);
      else if (customPage !== "") paginate(num); // clamp will fix out-of-range
    }
  };

  const handleGoClick = () => {
    const num = Number(customPage);
    if (!customPage) return;
    paginate(num);
  };

  return (
    <div className="pst-card">
      <h2 className="pst-title">Ürün Bazlı Satış Tablosu</h2>
      {productData.length > 0 ? (
        <div className="pst-tableWrapper">
          <table className="pst-table">
            <thead>
              <tr>
                <th className="pst-th left">#</th> {/* sabit global indeks sütunu */}
                <th className="pst-th left">Ürün</th>
                <th className="pst-th right">Toplam Satış Adedi</th>
                <th className="pst-th right">Toplam Gelir (₺)</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((p, idx) => {
                const globalIndex = indexOfFirstItem + idx; // sabit, sayfalar arası değişmez
                return (
                  <tr key={globalIndex} className={globalIndex % 2 === 0 ? "pst-row pst-row-even" : "pst-row pst-row-odd"}>
                    <td className="pst-td">{globalIndex + 1}</td>
                    <td className="pst-td">{p.productName}</td>
                    <td className="pst-td right">{p.totalQuantity.toLocaleString('tr-TR')}</td>
                    <td className="pst-td right pst-revenue">₺{p.totalRevenue.toLocaleString('tr-TR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="pst-pagination">
            {/* Prev */}
            <button
              onClick={() => paginate(currentPage - 1)}
              className="pst-pageBtn"
              aria-label="Önceki"
              disabled={currentPage === 1}
            >
              ‹
            </button>

            {/* visible pages (1 2 3 etc.) */}
            {getVisiblePages().map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`pst-pageBtn ${currentPage === number ? 'active' : ''}`}
                aria-label={`Sayfa ${number}`}
              >
                {number}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => paginate(currentPage + 1)}
              className="pst-pageBtn"
              aria-label="Sonraki"
              disabled={currentPage === totalPages}
            >
              ›
            </button>

            {/* custom page jump */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 12 }}>
              <input
                className="pst-pageInput"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={`Sayfa (1-${totalPages})`}
                value={customPage}
                onChange={handleCustomChange}
                onKeyDown={handleCustomKey}
                aria-label="Özel sayfa numarası"
                style={{
                  width: 110,
                  padding: '6px 8px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(255,255,255,0.02)',
                  color: 'var(--text)',
                }}
              />
              <button
                onClick={handleGoClick}
                className="pst-pageBtn pst-goBtn"
                aria-label="Git"
                disabled={!customPage}
                title={`Git sayfa ${customPage}`}
              >
                Git
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="pst-empty">Ürün verisi bulunamadı.</p>
      )}
    </div>
  );
}

export default ProductSalesTable;

