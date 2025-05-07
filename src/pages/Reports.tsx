
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

  // Prepare data for buy/sale status chart
  const getBuySaleData = () => {
    if (!animals || animals.length === 0) return [];
    
    const statusCounts: {[key: string]: number} = {
      buy: 0,
      sale: 0,
      other: 0
    };
    
    animals.forEach((animal) => {
      if (!animal.buyorsale) {
        statusCounts.other++;
      } else if (typeof animal.buyorsale === 'string') {
        const status = animal.buyorsale.toLowerCase();
        if (status === 'buy' || status === 'sale') {
          statusCounts[status]++;
        } else {
          statusCounts.other++;
        }
      } else {
        statusCounts.other++;
      }
    });
    
    return Object.keys(statusCounts).map((status) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: statusCounts[status],
    }));
  };

  // Prepare data for tools count chart
  const getToolCountData = () => {
    if (!tools || tools.length === 0) return [];
    
    // Group tools by name and sum their counts
    const toolCounts: {[key: string]: number} = {};
    tools.forEach((tool) => {
      if (tool.name && tool.count !== undefined) {
        const name = tool.name;
        toolCounts[name] = (toolCounts[name] || 0) + tool.count;
      }
    });
    
    return Object.keys(toolCounts).map((name) => ({
      name: name,
      value: toolCounts[name],
    }));
  };

  // Custom colors for charts
  const COLORS = ["#4B7F52", "#8FB996", "#D9BC9F", "#5E4B37", "#83653A"];
  
  const buySaleData = getBuySaleData();
  const toolCountData = getToolCountData();

  // Safely calculate total number of animals
  const getTotalAnimalsCount = () => {
    if (!animals || animals.length === 0) return 0;
    return animals.reduce((total, animal) => total + (animal.animalcount || 0), 0);
  };

  // Safely calculate total value of animals
  const getTotalAnimalsValue = () => {
    if (!animals || animals.length === 0) return 0;
    return animals.reduce((total, animal) => 
      total + (animal.animalPrice || 0) * (animal.animalcount || 0), 0
    );
  };

  // Safely calculate total tools count
  const getTotalToolsCount = () => {
    if (!tools || tools.length === 0) return 0;
    return tools.reduce((total, tool) => total + (tool.count || 0), 0);
  };

  // Safely calculate total value of tools
  const getTotalToolsValue = () => {
    if (!tools || tools.length === 0) return 0;
    return tools.reduce((total, tool) => 
      total + (tool.price || 0) * (tool.count || 0), 0
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Farm Reports
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Animals by Buy/Sale Status</CardTitle>
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
                    data={buySaleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {buySaleData.map((entry, index) => (
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
            <CardTitle>Tools by Count</CardTitle>
          </CardHeader>
          <CardContent>
            {toolsLoading ? (
              <div className="flex justify-center py-24">
                <div className="loader"></div>
              </div>
            ) : tools && tools.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={toolCountData}
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
              <p className="text-2xl font-bold">{getTotalAnimalsCount()}</p>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-muted-foreground text-sm">Total Animals Value</p>
              <p className="text-2xl font-bold text-farm-green">
                ${getTotalAnimalsValue().toFixed(2)}
              </p>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-muted-foreground text-sm">Total Tools</p>
              <p className="text-2xl font-bold">{getTotalToolsCount()}</p>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-muted-foreground text-sm">Total Tools Value</p>
              <p className="text-2xl font-bold text-orange-500">
                ${getTotalToolsValue().toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
