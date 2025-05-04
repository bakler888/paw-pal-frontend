
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";

interface CareToolItem {
  id: number;
  name: string;
  purpose: string;
  quantity: number;
  purchaseDate: string;
  condition: string;
  notes?: string;
}

interface ToolCardProps {
  tool: CareToolItem;
  onDelete: (id: number) => void;
}

const ToolCard = ({ tool, onDelete }: ToolCardProps) => {
  const isGoodCondition = tool.condition.toLowerCase() === "good";
  
  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold">{tool.name}</h3>
            {isGoodCondition ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-orange-500" />
            )}
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Purpose:</span>
              <span className="font-medium">{tool.purpose}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quantity:</span>
              <span className="font-medium">{tool.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Purchased:</span>
              <span className="font-medium">{formatDate(tool.purchaseDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Condition:</span>
              <span
                className={`font-medium ${
                  isGoodCondition ? "text-green-600" : "text-orange-600"
                }`}
              >
                {tool.condition}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0 border-t bg-muted/50">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(tool.id)}
        >
          Delete
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/care-tools/${tool.id}`}>View</Link>
          </Button>
          <Button size="sm" className="bg-farm-brown hover:bg-farm-brown/90" asChild>
            <Link to={`/care-tools/edit/${tool.id}`}>Edit</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ToolCard;
