
import { CategoryTableVendor } from "../../components/Vendor/CategoryManagementVendor/CategoryManagementVendor";
import { SidebarWithBurgerMenuVendor } from "../../components/Vendor/Sidebar/Sidebar";
import { ComplexNavbarVendor } from "../../components/Vendor/VendorNavbar/VendorNavbar";

const CategoryManagementVendorPage = () => {
    return (
        <div>
            <ComplexNavbarVendor/>
            <div className="p-3">
                <div className="mt-28 flex">
                    <div className="fixed top-20 left-0 h-screen w-20 p-4  text-white z-50">
                        <SidebarWithBurgerMenuVendor />
                    </div>

                    <div className="ml-16 p-4 w-full">
                    <CategoryTableVendor />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CategoryManagementVendorPage;