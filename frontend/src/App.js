// src/App.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import MonthlySalesChart from "./MonthlySalesChart";
import ProductSalesTable from "./ProductSalesTable";

function App() {
  const vendorId = "6274b952e696a4eff31e49eb"; // MongoDB'deki vendor _id
  const [monthlyData, setMonthlyData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching data for vendor:', vendorId);

        // 1. Aylık satışları çek
        console.log('Fetching monthly sales...');
        const monthlyResponse = await axios.get(`http://localhost:5000/api/vendors/${vendorId}/monthly-sales`);
        console.log('Monthly data:', monthlyResponse.data);
        setMonthlyData(monthlyResponse.data || []);

        // 2. Ürün bazlı satışları çek
        console.log('Fetching product sales...');
        const productResponse = await axios.get(`http://localhost:5000/api/vendors/${vendorId}/product-sales`);
        console.log('Product data:', productResponse.data);
        setProductData(productResponse.data || []);

      } catch (err) {
        console.error('Detailed error:', err);
        console.error('Error response:', err.response);
        console.error('Error message:', err.message);
        console.error('Error config:', err.config);
        
        let errorMessage = 'Veri yüklenirken hata oluştu. ';
        
        if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
          errorMessage += 'Backend sunucusu çalışmıyor. http://localhost:5000 adresinde backend çalıştığından emin olun.';
        } else if (err.response) {
          errorMessage += `HTTP ${err.response.status}: ${err.response.statusText}`;
          if (err.response.data && err.response.data.message) {
            errorMessage += ` - ${err.response.data.message}`;
          }
        } else {
          errorMessage += err.message;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if vendorId is not the placeholder
    if (vendorId && vendorId !== "YOUR_VENDOR_ID_HERE") {
      fetchData();
    } else {
      setLoading(false);
      setError('Vendor ID ayarlanmamış. App.js dosyasında vendorId değişkenini gerçek vendor ID ile değiştirin.');
    }
  }, [vendorId]);

  // Chart.js verisine dönüştür
  const chartData = {
    labels: monthlyData.map(d => `${d._id.month}/${d._id.year}`),
    datasets: [
      {
        label: "Toplam Satış (₺)",
        data: monthlyData.map(d => parseFloat(d.totalSales.toFixed(2))),
        fill: false,
        backgroundColor: "rgb(59, 130, 246)",
        borderColor: "rgb(59, 130, 246)",
        tension: 0.1,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Aylık Satış Trendi'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₺' + value.toLocaleString('tr-TR');
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Yükleniyor...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
        <h2>Hata</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Tekrar Dene</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#333", marginBottom: "30px" }}>Satış Analiz Paneli</h1>
      
      {/* Chart Section */}
      <MonthlySalesChart monthlyData={monthlyData} loading={loading} error={error} />

      {/* Table Section */}
      <ProductSalesTable productData={productData} />
    </div>
  );
}

export default App;