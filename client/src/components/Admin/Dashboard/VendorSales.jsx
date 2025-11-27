import { PieChart, Pie, Cell } from 'recharts';

const data = [
  { name: 'Vendor 1', value: 400 },
  { name: 'Vendor 2', value: 300 },
  { name: 'Vendor 3', value: 100 },
  { name: 'Vendor 4', value: 200 },
  { name: 'Vendor 5', value: 600 },
  { name: 'Vendor 6', value: 900 },
  { name: 'Vendor 7', value: 200 },
];

const COLORS = ['#FF8800', '#1C1010', '#4A11F3', '#D14D86', '#FF27A9', '#84389D', '#55889A'];

export default function VendorSaleChart() {
    return (
        <div className='bg-white rounded-xl p-6  shadow-md'>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Vendors Sales</h2>
            </div>
        
        <div className="bg-white p-6 flex flex-col lg:flex-row justify-between items-center">
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
                <h2 className="text-lg font-semibold mb-4">Vendor Sales</h2>
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
        </div>
    );
}
