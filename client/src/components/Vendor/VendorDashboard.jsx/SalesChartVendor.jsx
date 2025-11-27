import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const data = [
  { name: '1 Dec', thisYear: 25, lastYear: 15 },
  { name: '2 Dec', thisYear: 30, lastYear: 20 },
  { name: '3 Dec', thisYear: 27, lastYear: 19 },
  { name: '4 Dec', thisYear: 23, lastYear: 10 },
  { name: '5 Dec', thisYear: 15, lastYear: 8 },
  { name: '6 Dec', thisYear: 30, lastYear: 15 },
  { name: '7 Dec', thisYear: 22, lastYear: 18 },
];

export default function SalesChartVendor() {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Latest Sales</h2>
            <select className="border p-2 rounded-md">
            <option>Today</option>
            <option>Last 7 Days</option>
            <option>Last 1 Month</option>
            <option>Last 2 Months</option>
            <option>Last 1 Year</option>
            </select>
        </div>
        <BarChart width={500} height={400} data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip/>
            <Legend />
            <Bar dataKey="thisYear" fill="#ff4d4f" />
            <Bar dataKey="lastYear" fill="#d9d9d9" />
        </BarChart >
        </div>
    );
}
