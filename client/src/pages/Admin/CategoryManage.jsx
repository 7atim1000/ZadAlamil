import { ComplexNavbar } from "../../components/Admin/Navbar/NavbarComp.jsx"
import { SidebarWithBurgerMenu } from "../../components/Admin/Sidebar/SidebarComp.jsx";
import CategoryTable from "../../components/Admin/CategoryManagement/CategoryManage.jsx";

const CategoryManagement = () => {
  return (
    <div>
        <ComplexNavbar />
        <div className="p-3">
            <div className="mt-28 flex">
                <div className="fixed top-20 left-0 h-screen w-20 p-4  text-white z-50">
                    <SidebarWithBurgerMenu />
                </div>

                <div className="ml-16 p-4 w-full ">
                  <CategoryTable />
                </div>
            </div>
        </div>
    </div>
  )
}

export default CategoryManagement;
