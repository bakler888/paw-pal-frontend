
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AuthGuard from "./components/AuthGuard";
import MainLayout from "./layouts/MainLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Animals from "./pages/Animals";
import AnimalDetails from "./pages/AnimalDetails";
import AddAnimal from "./pages/AddAnimal";
import EditAnimal from "./pages/EditAnimal";
import CareTools from "./pages/CareTools";
import ToolDetails from "./pages/ToolDetails";
import AddTool from "./pages/AddTool";
import EditTool from "./pages/EditTool";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute cache
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route element={<AuthGuard requireAuth={false} />}>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<AuthGuard requireAuth={true} />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Animal Routes */}
                <Route path="/animals" element={<Animals />} />
                <Route path="/animals/:id" element={<AnimalDetails />} />
                <Route path="/animals/add" element={<AddAnimal />} />
                <Route path="/animals/edit/:id" element={<EditAnimal />} />
                
                {/* Care Tools Routes */}
                <Route path="/care-tools" element={<CareTools />} />
                <Route path="/care-tools/:id" element={<ToolDetails />} />
                <Route path="/care-tools/add" element={<AddTool />} />
                <Route path="/care-tools/edit/:id" element={<EditTool />} />

                {/* Reports Route */}
                <Route path="/reports" element={<Reports />} />
              </Route>
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
