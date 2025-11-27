import { Button } from '@material-tailwind/react';
import { DocumentIcon } from "@heroicons/react/24/outline";
import { ChartBarIcon, CurrencyDollarIcon, UserGroupIcon, ArrowPathIcon, ReceiptRefundIcon } from "@heroicons/react/24/solid";
import StatsCardVendor from './StatsCardVendor.jsx';
import CategoryChartVendor from './CategoryChartVendor.jsx';
import SalesChartVendor from './SalesChartVendor.jsx';
import { OrderTable } from './OrderTable.jsx';

export default function VendorDashboard() {
    return (
        <div className="p-6  bg-gray-50 min-h-screen w-full">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Button className="flex items-center gap-2 bg-blue-100 text-blue-700">
            <DocumentIcon className="w-5 h-5"/> Sales Report
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatsCardVendor title="Sales" value="6789" icon={ChartBarIcon} />
            <StatsCardVendor title="Revenue" value="AED 78965.00" icon={CurrencyDollarIcon} />
            <StatsCardVendor title="Users" value="256789" icon={UserGroupIcon} />
            <StatsCardVendor title="Returns" value="1678" icon={ArrowPathIcon} />
            <StatsCardVendor title="Refund" value="1678" icon={ReceiptRefundIcon} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SalesChartVendor />
            <CategoryChartVendor />
        </div>

        <section className='mt-5'>
            <div>
                <OrderTable />
            </div>
        </section>
        </div>
    );
}
