import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Register required chart types
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
  if (!data || Object.keys(data).length === 0) {
    return <div className="p-4 text-center text-gray-500">Loading stats...</div>;
  }

  const {
    total_personnel = 0,
    available_for_duty = 0,
    rank_distribution = {},
    status_distribution = {},
  } = data;

  const personnelData = {
    labels: ['Total', 'Available'],
    datasets: [
      {
        label: 'Personnel Count',
        data: [total_personnel, available_for_duty],
        backgroundColor: ['#00C49F', '#0088FE'],
        borderRadius: 6,
        barThickness: 30
      },
    ],
  };

  const rankChartData = {
    labels: Object.keys(rank_distribution),
    datasets: [
      {
        label: 'Rank Distribution',
        data: Object.values(rank_distribution),
        backgroundColor: COLORS.slice(0, Object.keys(rank_distribution).length),
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
        backgroundColor: COLORS.slice(2, 2 + Object.keys(status_distribution).length),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 py-8">
      {/* Personnel Count */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4">
        <h2 className="text-base font-semibold mb-2 text-gray-800">Personnel Count</h2>
        <p className="text-sm text-gray-600 mb-4">
          Total: <strong>{total_personnel}</strong> | Available: <strong>{available_for_duty}</strong>
        </p>
        <div className="h-[200px]">
          <Bar
            data={personnelData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
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
      </div>

      {/* Rank Distribution */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4">
        <h2 className="text-base font-semibold mb-2 text-gray-800">Rank Distribution</h2>
        <ul className="text-sm text-gray-600 mb-2">
          {Object.entries(rank_distribution).map(([rank, count]) => (
            <li key={rank}>
              {rank}: <strong>{count}</strong>
            </li>
          ))}
        </ul>
        <div className="h-[200px]">
          <Pie
            data={rankChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'bottom' },
                tooltip: { enabled: true },
              },
            }}
          />
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4">
        <h2 className="text-base font-semibold mb-2 text-gray-800">Status Distribution</h2>
        <ul className="text-sm text-gray-600 mb-2">
          {Object.entries(status_distribution).map(([status, count]) => (
            <li key={status}>
              {status}: <strong>{count}</strong>
            </li>
          ))}
        </ul>
        <div className="h-[200px]">
          <Pie
            data={statusChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'bottom' },
                tooltip: { enabled: true },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPersonnelStats;
