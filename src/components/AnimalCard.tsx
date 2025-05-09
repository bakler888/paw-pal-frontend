
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { Animal } from "@/types";

interface AnimalCardProps {
  animal: Animal;
  onDelete: (id: number) => void;
}

const AnimalCard = ({ animal, onDelete }: AnimalCardProps) => {
  // Safely determine if this is a buy record
  const isBuying = animal.buyorsale === "buy";

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold">{animal.name}</h3>
            {isBuying ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            )}
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium">
                {isBuying ? "Purchase" : "Sale"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price:</span>
              <span className="font-medium">{animal.animalPrice} $</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Count:</span>
              <span className="font-medium">{animal.animalcount || 1}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span
                className={`font-medium ${
                  isBuying ? "text-green-600" : "text-yellow-600"
                }`}
              >
                {isBuying ? "Buy" : "Sale"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0 border-t bg-muted/50">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(animal.animalID || 0)}
        >
          Delete
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/animals/${animal.animalID}`}>View</Link>
          </Button>
          <Button size="sm" className="bg-farm-green hover:bg-farm-green/90" asChild>
            <Link to={`/animals/edit/${animal.animalID}`}>Edit</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AnimalCard;
