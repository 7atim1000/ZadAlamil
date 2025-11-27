import { PieChart, Pie, Cell } from 'recharts';

const data = [
  { name: 'Mobiles & Tablets', value: 400 },
  { name: 'Wearables & Smart Watches', value: 300 },
  { name: 'TV & Audio', value: 100 },
  { name: 'Appliances', value: 200 },
  { name: 'Personal Care', value: 600 },
  { name: 'Computing', value: 900 },
  { name: 'Routers', value: 200 },
  { name: 'Gaming', value: 50 },
  { name: 'Photography', value: 250 },
  { name: 'Accessories', value: 290 },
];

const COLORS = ['#FF8800', '#1C1010', '#4A11F3', '#D14D86', '#FF27A9', '#84389D', '#55889A', '#85A84C', '#CE9F47', '#B14040'];

export default function CategoryChartVendor() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col lg:flex-row justify-between items-center">
      <div className="flex-shrink-0">
        <PieChart width={300} height={300}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </div>

      <div className="mt-6 lg:mt-0 lg:ml-10">
        <h2 className="text-lg font-semibold mb-4">Category Sales</h2>
        <ul className="space-y-2">
          {data.map((entry, index) => (
            <li key={index} className="flex items-center gap-2">
              <span
                className="w-4 h-4 inline-block rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></span>
              {entry.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
