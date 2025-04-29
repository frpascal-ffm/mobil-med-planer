
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Ambulance, Calendar, Users, Truck, Settings, LogOut } from "lucide-react";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger
} from "@/components/ui/sidebar";

const AdminLayout = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // In a real app, this would be handling actual logout logic
    navigate('/login');
  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4">
              <Ambulance className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">MobilMedPlaner</span>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/admin" 
                    end
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-3 py-2 rounded-md ${
                        isActive ? "bg-primary text-white" : "hover:bg-sidebar-accent"
                      }`
                    }
                  >
                    <Calendar className="h-5 w-5" />
                    <span>Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/admin/schedule" 
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-3 py-2 rounded-md ${
                        isActive ? "bg-primary text-white" : "hover:bg-sidebar-accent"
                      }`
                    }
                  >
                    <Calendar className="h-5 w-5" />
                    <span>Fahrtenplanung</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/admin/vehicles" 
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-3 py-2 rounded-md ${
                        isActive ? "bg-primary text-white" : "hover:bg-sidebar-accent"
                      }`
                    }
                  >
                    <Truck className="h-5 w-5" />
                    <span>Fahrzeuge</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/admin/staff" 
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-3 py-2 rounded-md ${
                        isActive ? "bg-primary text-white" : "hover:bg-sidebar-accent"
                      }`
                    }
                  >
                    <Users className="h-5 w-5" />
                    <span>Mitarbeiter</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/admin/settings" 
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-3 py-2 rounded-md ${
                        isActive ? "bg-primary text-white" : "hover:bg-sidebar-accent"
                      }`
                    }
                  >
                    <Settings className="h-5 w-5" />
                    <span>Einstellungen</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter>
            <div className="px-4 py-4">
              <Button 
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Abmelden</span>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b bg-white flex items-center">
            <SidebarTrigger />
            <h1 className="ml-4 text-xl font-semibold">Admin Dashboard</h1>
          </div>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
