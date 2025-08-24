import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function MonthlySalesChart({ monthlyData, loading, error }) {
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
    <div style={{ marginBottom: "50px" }}>
      <h2 style={{ color: "#666", marginBottom: "20px" }}>Aylık Satış Grafiği</h2>
      {monthlyData.length > 0 ? (
        <div style={{ height: "400px", marginBottom: "20px" }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "#666" }}>Grafik verisi bulunamadı.</p>
      )}
    </div>
  );
}

export default MonthlySalesChart;

