
import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllAnimals, getAllCareTools } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CircleDollarSign,
  HelpCircle,
  Package2,
  ShoppingCart,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface Animal {
  animalID: number;
  name: string;
  animalPrice: number;
  animalcount?: number;
  description?: string;
  buyorsale: string | number;
  dateOfbuyorsale?: string;
  animalCares?: string[];
}

interface CareToolItem {
  id?: number;
  name: string;
  price: number;
  count?: number;
  description?: string;
}

const Dashboard = () => {
  const { data: animals = [], isLoading: animalsLoading } = useQuery({
    queryKey: ["animals"],
    queryFn: getAllAnimals,
  });

  const { data: careTools = [], isLoading: toolsLoading } = useQuery({
    queryKey: ["careTools"],
    queryFn: getAllCareTools,
  });

  // Calculate dashboard metrics
  const totalAnimals = animals.length;
  const purchaseAnimals = animals.filter((animal) => 
    animal.buyorsale?.toString()?.toLowerCase() === "buy"
  ).length;
  const saleAnimals = totalAnimals - purchaseAnimals;

  const totalTools = careTools.length;
  const goodConditionTools = careTools.length; // Adjust if you have condition data
  const needsAttentionTools = 0; // Adjust if you have condition data

  // Calculate financial metrics
  const animalInvestment = animals.reduce(
    (sum, animal) => sum + (animal.animalPrice * (animal.animalcount || 1)),
    0
  );
  const toolsInvestment = careTools.reduce(
    (sum, tool) => sum + (tool.price * (tool.count || 1)),
    0
  );
  const totalInvestment = animalInvestment + toolsInvestment;

  // Get recent animals and tools
  const recentAnimals = [...animals]
    .sort((a, b) => {
      const dateA = a.dateOfbuyorsale ? new Date(a.dateOfbuyorsale).getTime() : 0;
      const dateB = b.dateOfbuyorsale ? new Date(b.dateOfbuyorsale).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3);

  const recentTools = [...careTools].slice(0, 3);

  if (animalsLoading || toolsLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Animals Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-sm font-medium">Total Animals</CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAnimals}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {purchaseAnimals} purchases, {saleAnimals} sales
            </p>
            <Progress
              value={(purchaseAnimals / (totalAnimals || 1)) * 100}
              className="mt-3 h-1"
            />
          </CardContent>
        </Card>

        {/* Total Tools Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-sm font-medium">Care Tools</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTools}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {goodConditionTools} in stock
            </p>
            <Progress
              value={(goodConditionTools / (totalTools || 1)) * 100}
              className="mt-3 h-1"
            />
          </CardContent>
        </Card>

        {/* Total Investment Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-sm font-medium">
              Total Investment
            </CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalInvestment.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ${animalInvestment.toFixed(2)} in animals,{" "}
              ${toolsInvestment.toFixed(2)} in tools
            </p>
            <Progress
              value={(animalInvestment / (totalInvestment || 1)) * 100}
              className="mt-3 h-1"
            />
          </CardContent>
        </Card>

        {/* Care Needs Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-sm font-medium">Care Needs</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{needsAttentionTools}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tools needing attention
            </p>
            <Progress
              value={
                ((totalTools - needsAttentionTools) / (totalTools || 1)) * 100
              }
              className="mt-3 h-1"
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Animals */}
      <Card>
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <CardTitle>Recent Animals</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to="/animals">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentAnimals.length > 0 ? (
            <div className="space-y-4">
              {recentAnimals.map((animal) => (
                <div
                  key={animal.animalID}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div>
                    <div className="font-medium">{animal.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Type: {animal.buyorsale?.toString() === "buy" ? "Purchase" : "Sale"} | Count: {animal.animalcount || 1}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`px-2 py-1 rounded-full text-xs ${
                        animal.buyorsale?.toString()?.toLowerCase() === "buy"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {animal.buyorsale?.toString()?.toLowerCase() === "buy" ? "Buy" : "Sale"}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                      asChild
                    >
                      <Link to={`/animals/${animal.animalID}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p>No animals added yet</p>
              <Button className="mt-2" asChild>
                <Link to="/animals/add">Add Animal</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Tools */}
      <Card>
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <CardTitle>Recent Tools</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to="/care-tools">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentTools.length > 0 ? (
            <div className="space-y-4">
              {recentTools.map((tool) => (
                <div
                  key={tool.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div>
                    <div className="font-medium">{tool.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Price: ${tool.price} | Count: {tool.count || 1}
                    </div>
                  </div>
                  <div>
                    <div className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      Tool
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                      asChild
                    >
                      <Link to={`/care-tools/${tool.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p>No care tools added yet</p>
              <Button className="mt-2" asChild>
                <Link to="/care-tools/add">Add Care Tool</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
