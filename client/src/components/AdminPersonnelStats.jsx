// src/components/AdminPersonnelStats.jsx
import {
  Bar,
  Pie
} from 'react-chartjs-2';

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#D65DB1'];

const AdminPersonnelStats = ({ data }) => {
    if (!data) {
    return <div className="p-4 text-center text-gray-500">Loading stats...</div>;
  }

  const {
    total_personnel,
    available_for_duty,
    rank_distribution,
    status_distribution,
  } = data;

  const personnelData = {
    labels: ['Total Personnel', 'Available for Duty'],
    datasets: [
      {
        label: 'Personnel Count',
        data: [total_personnel, available_for_duty],
        backgroundColor: ['#00C49F', '#0088FE'],
        borderRadius: 8,
      },
    ],
  };

  const rankChartData = {
    labels: Object.keys(rank_distribution),
    datasets: [
      {
        label: 'Rank Distribution',
        data: Object.values(rank_distribution),
        backgroundColor: COLORS,
        borderWidth: 1,
      },
    ],
  };

  const statusChartData = {
    labels: Object.keys(status_distribution),
    datasets: [
      {
        label: 'Status Distribution',
        data: Object.values(status_distribution),
        backgroundColor: COLORS.slice(2),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Personnel Count</h2>
        <Bar
          data={personnelData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true },
            },
            scales: {
              y: { beginAtZero: true },
            },
          }}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Rank Distribution</h2>
        <Pie
          data={rankChartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'bottom' },
              tooltip: { enabled: true },
            },
          }}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Status Distribution</h2>
        <Pie
          data={statusChartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'bottom' },
              tooltip: { enabled: true },
            },
          }}
        />
      </div>
    </div>
  );
};

export default AdminPersonnelStats;
