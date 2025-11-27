import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { getCategories } from '../../../Utils/categoryService';
import { useSelector } from 'react-redux';

const COLORS = ['#FF8800', '#1C1010', '#4A11F3', '#D14D86', '#FF27A9', '#84389D', '#55889A', '#85A84C', '#CE9F47', '#B14040'];

const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

export default function CategoryChart() {
    const [categories, setCategories] = useState([]);
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
      if (token) {
          const fetchCategories = async () => {
              try {
                  const { categories: fetchedCategories } = await getCategories(token);
                  const mappedCategories = fetchedCategories.map((cat) => ({
                      categoryName: cat.name,
                      categoryId: cat._id,
                      value: cat.sales || Math.floor(Math.random() * 100), 
                  }));

                  setCategories(mappedCategories);
              } catch (error) {
                  console.error("Error fetching categories:", error);
              }
          };
          fetchCategories();
      }
  }, [token]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col lg:flex-row justify-between items-center">
      <div className="flex-shrink-0">
        
        <PieChart width={300} height={300}>
          <Pie
            data={categories}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            nameKey="categoryName"
            label
          >
            {categories.map((category, index) => (
              <Cell 
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length] || getRandomColor()} />
            ))}
          </Pie>
        </PieChart>
      </div>

      <div className="mt-6 lg:mt-0 lg:ml-10">
        <h2 className="text-lg font-semibold mb-4">Category Sales</h2>
        <ul className="space-y-2">
          {categories.map((category, index) => (
            <li key={category.categoryId} className="flex items-center gap-2">
              <span
                className="w-4 h-4 inline-block rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></span>
              {category.categoryName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
