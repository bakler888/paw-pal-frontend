
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface Animal {
  id: number;
  name: string;
  breed: string;
  age: number;
  weight: number;
  healthStatus: string;
  notes?: string;
}

interface AnimalCardProps {
  animal: Animal;
  onDelete: (id: number) => void;
}

const AnimalCard = ({ animal, onDelete }: AnimalCardProps) => {
  const isHealthy = animal.healthStatus.toLowerCase() === "healthy";

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold">{animal.name}</h3>
            {isHealthy ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            )}
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Breed:</span>
              <span className="font-medium">{animal.breed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Age:</span>
              <span className="font-medium">{animal.age} years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Weight:</span>
              <span className="font-medium">{animal.weight} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Health:</span>
              <span
                className={`font-medium ${
                  isHealthy ? "text-green-600" : "text-yellow-600"
                }`}
              >
                {animal.healthStatus}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0 border-t bg-muted/50">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(animal.id)}
        >
          Delete
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/animals/${animal.id}`}>View</Link>
          </Button>
          <Button size="sm" className="bg-farm-green hover:bg-farm-green/90" asChild>
            <Link to={`/animals/edit/${animal.id}`}>Edit</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AnimalCard;
