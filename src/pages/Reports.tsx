
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllAnimals, getAllCareTools } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const Reports = () => {
  const { data: animals, isLoading: animalsLoading } = useQuery({
    queryKey: ["animals"],
    queryFn: getAllAnimals,
  });

  const { data: tools, isLoading: toolsLoading } = useQuery({
    queryKey: ["careTools"],
    queryFn: getAllCareTools,
  });

  // Prepare data for health status chart
  const getHealthStatusData = () => {
    if (!animals || animals.length === 0) return [];
    
    const statusCounts: {[key: string]: number} = {};
    animals.forEach((animal) => {
      const status = animal.healthStatus;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    return Object.keys(statusCounts).map((status) => ({
      name: status,
      value: statusCounts[status],
    }));
  };

  // Prepare data for tools condition chart
  const getToolConditionData = () => {
    if (!tools || tools.length === 0) return [];
    
    const conditionCounts: {[key: string]: number} = {};
    tools.forEach((tool) => {
      const condition = tool.condition;
      conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
    });
    
    return Object.keys(conditionCounts).map((condition) => ({
      name: condition,
      value: conditionCounts[condition],
    }));
  };

  // Custom colors for charts
  const COLORS = ["#4B7F52", "#8FB996", "#D9BC9F", "#5E4B37", "#83653A"];
  
  const healthStatusData = getHealthStatusData();
  const toolConditionData = getToolConditionData();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Farm Reports
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Animals by Health Status</CardTitle>
          </CardHeader>
          <CardContent>
            {animalsLoading ? (
              <div className="flex justify-center py-24">
                <div className="loader"></div>
              </div>
            ) : animals && animals.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={healthStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {healthStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-24">
                <p className="text-muted-foreground">No animal data available</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tools by Condition</CardTitle>
          </CardHeader>
          <CardContent>
            {toolsLoading ? (
              <div className="flex justify-center py-24">
                <div className="loader"></div>
              </div>
            ) : tools && tools.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={toolConditionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" name="Count" fill="#5E4B37" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-24">
                <p className="text-muted-foreground">No tool data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Farm Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-muted p-4 rounded-md">
              <p className="text-muted-foreground text-sm">Total Animals</p>
              <p className="text-2xl font-bold">{animals?.length || 0}</p>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-muted-foreground text-sm">Healthy Animals</p>
              <p className="text-2xl font-bold text-farm-green">
                {animals?.filter((a) => a.healthStatus.toLowerCase() === "healthy").length || 0}
              </p>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-muted-foreground text-sm">Total Tools</p>
              <p className="text-2xl font-bold">{tools?.length || 0}</p>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-muted-foreground text-sm">Tools Needing Attention</p>
              <p className="text-2xl font-bold text-orange-500">
                {tools?.filter((t) => t.condition.toLowerCase() !== "good").length || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
