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
import "./MonthlySalesChart.css";

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
        backgroundColor: "rgba(14,165,233,0.95)",
        borderColor: "rgba(14,165,233,0.95)",
        tension: 0.15,
        pointBackgroundColor: "#fff",
        pointBorderColor: "rgba(14,165,233,0.95)",
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
        labels: { color: '#E6F6F9' }
      },
      title: {
        display: true,
        text: 'Aylık Satış Trendi',
        color: '#E6F6F9',
        font: { weight: '600', size: 16 }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#E6F6F9',
        bodyColor: '#E6F6F9'
      }
    },
    scales: {
      x: {
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(226,232,240,0.06)' }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#cbd5e1',
          callback: function(value) {
            return '₺' + value.toLocaleString('tr-TR');
          }
        },
        grid: { color: 'rgba(226,232,240,0.06)' }
      }
    }
  };

  if (loading) {
    return (
      <div className="ms-card ms-loading">
        <h2>Yükleniyor...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ms-card ms-error">
        <h2>Hata</h2>
        <p>{error}</p>
        <button className="ms-retry" onClick={() => window.location.reload()}>Tekrar Dene</button>
      </div>
    );
  }

  return (
    <div className="ms-card ms-container">
      <h2 className="ms-title">Aylık Satış Grafiği</h2>
      {monthlyData.length > 0 ? (
        <div className="ms-chartWrapper">
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : (
        <p className="ms-empty">Grafik verisi bulunamadı.</p>
      )}
    </div>
  );
}

export default MonthlySalesChart;

