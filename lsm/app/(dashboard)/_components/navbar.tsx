import { NavbarRoutes } from "@/components/navbarRoutes"
import { MobileSideBar } from "./mobileSideBar"

export const Navbar = () => {
    return (
        <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
            <MobileSideBar />
            <NavbarRoutes />
        </div>
    )
}