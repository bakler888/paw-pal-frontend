
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CareToolItem } from "@/types";

interface ToolCardProps {
  tool: CareToolItem;
  onDelete: (id: number) => void;
}

const ToolCard = ({ tool, onDelete }: ToolCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold">{tool.name}</h3>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price:</span>
              <span className="font-medium">${tool.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Count:</span>
              <span className="font-medium">{tool.count || 1}</span>
            </div>
            {tool.description && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Description:</span>
                <span className="font-medium line-clamp-1">{tool.description}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0 border-t bg-muted/50">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(tool.id || 0)}
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
