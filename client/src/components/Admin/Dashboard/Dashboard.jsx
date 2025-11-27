import StatsCard from './StastsCard.jsx';
import SalesChart from './SalesChart.jsx';
import CategoryChart from './CategoryChart.jsx';
import { Button } from '@material-tailwind/react';
import { DocumentIcon } from "@heroicons/react/24/outline";
import { ChartBarIcon, CurrencyDollarIcon, UserGroupIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import VendorSaleChart from './VendorSales.jsx';
import { VendorTable } from './VendorTable.jsx';

import { getDashboard } from '../../../Utils/DashboardApi.js';
import { useState, useEffect } from 'react';
import { FaProductHunt } from "react-icons/fa6";
import { MdCategory } from "react-icons/md";

export default function Dashboard() {

  const [dashboard, setDashboard] = useState({}); // Initialize as object, not array
  const [loading, setLoading] = useState(false); // Initialize as boolean

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const data = await getDashboard();
      setDashboard(data.dashboardData || data.dashboard || {}); // Adjust based on your actual API response

    } catch (error) {
      // Handle authentication errors with toast
      if (error.message === "Unauthorized: No token found!" ||
        error.message.includes("Unauthorized") ||
        error.message.includes("401") ||
        error.message.includes("Access denied")) {

        toast.error("Please login to access dashboard");
        navigate('/admin/admin-login');
      } else {
        toast.error(error.message || "Failed to load dashboard data");
      }

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);


  
  return (
    <div className="p-6  bg-gray-50 min-h-screen w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button className="flex items-center gap-2 bg-blue-100 text-blue-700">
          <DocumentIcon className="w-5 h-5"/> Sales Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-8">
        <StatsCard title="Users"  value={dashboard?.totalUsers || 0}  icon={UserGroupIcon} />
        <StatsCard title="Categories"  value={dashboard?.totalCategories || 0 } icon ={MdCategory} />
        <StatsCard title="Products"  value={dashboard?.totalProducts || 0}  icon={FaProductHunt} />

        <StatsCard title="Sales" value="6789" icon={ChartBarIcon} />
        <StatsCard title="Revenue" value="AED 78965.00" icon={CurrencyDollarIcon} />
        <StatsCard title="Returns" value="1678" icon={ArrowPathIcon} />

        

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <CategoryChart />
      </div>

      <section className='mt-5'>
        <div>
          {/* <VendorSaleChart /> */}
        </div>
        <section className='mt-5'>
          <div>
            {/* <VendorTable /> */}
          </div>
        </section>
      </section>
    </div>
  );
}
