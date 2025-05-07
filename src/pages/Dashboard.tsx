
import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllAnimals, getAllCareTools } from "@/services/api";
import { PiggyBank, AlertTriangle, BarChart3 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const { data: animals, isLoading: animalsLoading, error: animalsError } = useQuery({
    queryKey: ["animals"],
    queryFn: getAllAnimals,
    onError: (error) => {
      console.error("Error fetching animals:", error);
    }
  });

  const { data: tools, isLoading: toolsLoading, error: toolsError } = useQuery({
    queryKey: ["careTools"],
    queryFn: getAllCareTools,
    onError: (error) => {
      console.error("Error fetching care tools:", error);
    }
  });

  // Calculate animals with health issues - safely handle undefined values
  const animalsWithHealthIssues = animals 
    ? animals.filter((animal) => 
        animal?.healthStatus?.toLowerCase() !== "healthy"
      ).length
    : 0;

  // Calculate tools that need maintenance - safely handle undefined values
  const toolsNeedingMaintenance = tools 
    ? tools.filter((tool) => 
        tool?.condition?.toLowerCase() !== "good"
      ).length
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome, {user?.name || "User"}
        </h1>
        <div className="flex space-x-2">
          <Button className="bg-farm-green hover:bg-farm-green/90">
            <Link to="/animals/add">Add Animal</Link>
          </Button>
          <Button className="bg-farm-brown hover:bg-farm-brown/90">
            <Link to="/care-tools/add">Add Tool</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Animals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {animalsLoading ? "-" : (animals?.length || 0)}
              </div>
              <PiggyBank className="h-8 w-8 text-farm-green" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Manage your farm animals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Care Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {toolsLoading ? "-" : tools?.length || 0}
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24" 
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-farm-brown"
              >
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Tools in your inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Health Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {animalsLoading ? "-" : animalsWithHealthIssues}
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Animals need attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Maintenance Needed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {toolsLoading ? "-" : toolsNeedingMaintenance}
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24" 
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-orange-500"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="M13 9h4" />
                <path d="M13 15h4" />
                <path d="M9 15h.01" />
              </svg>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Tools need maintenance
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Animals</CardTitle>
            </div>
            <Button variant="outline" size="sm">
              <Link to="/animals">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {animalsLoading ? (
              <div className="flex justify-center py-8">
                <div className="loader"></div>
              </div>
            ) : animalsError ? (
              <div className="text-center py-8">
                <p className="text-red-500">Error loading animals</p>
                <Button className="mt-4 bg-farm-green hover:bg-farm-green/90">
                  <Link to="/animals/add">Add Animal</Link>
                </Button>
              </div>
            ) : animals && animals.length > 0 ? (
              <div className="space-y-4">
                {animals.slice(0, 5).map((animal) => (
                  <div
                    key={animal.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-md"
                  >
                    <div>
                      <p className="font-medium">{animal.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {animal.breed}, {animal.age} years
                      </p>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          animal.healthStatus?.toLowerCase() === "healthy"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {animal.healthStatus || "Unknown"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No animals added yet</p>
                <Button className="mt-4 bg-farm-green hover:bg-farm-green/90">
                  <Link to="/animals/add">Add Animal</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Care Tools</CardTitle>
            </div>
            <Button variant="outline" size="sm">
              <Link to="/care-tools">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {toolsLoading ? (
              <div className="flex justify-center py-8">
                <div className="loader"></div>
              </div>
            ) : toolsError ? (
              <div className="text-center py-8">
                <p className="text-red-500">Error loading care tools</p>
                <Button className="mt-4 bg-farm-brown hover:bg-farm-brown/90">
                  <Link to="/care-tools/add">Add Tool</Link>
                </Button>
              </div>
            ) : tools && tools.length > 0 ? (
              <div className="space-y-4">
                {tools.slice(0, 5).map((tool) => (
                  <div
                    key={tool.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-md"
                  >
                    <div>
                      <p className="font-medium">{tool.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {tool.purpose}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tool.condition?.toLowerCase() === "good"
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {tool.condition || "Unknown"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No care tools added yet</p>
                <Button className="mt-4 bg-farm-brown hover:bg-farm-brown/90">
                  <Link to="/care-tools/add">Add Tool</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
