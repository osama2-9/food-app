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
} from "chart.js";
import { useGetRestaurantsOrders } from "../hooks/useGetRestaurantsOrders";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = () => {
  const { ordersStatistics } = useGetRestaurantsOrders();
  const reversed = ordersStatistics?.reverse();
  const chartData = {
    labels: reversed?.map((entry) => entry.date),
    datasets: [
      {
        label: "Orders Volume",
        data: reversed?.map((entry) => entry.count),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h2>Order Volume Over Time</h2>
      <Line data={chartData} /> 
    </div>
  );
};

export default LineChart;
