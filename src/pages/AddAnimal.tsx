
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAnimal } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import AnimalForm from "@/components/AnimalForm";
import { ArrowLeft } from "lucide-react";

const AddAnimal = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const addAnimalMutation = useMutation({
    mutationFn: (animalData: any) => addAnimal(animalData),
    onSuccess: () => {
      toast.success("Animal added successfully!");
      queryClient.invalidateQueries({ queryKey: ["animals"] });
      navigate("/animals");
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleSubmit = (values: any) => {
    addAnimalMutation.mutate(values);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link to="/animals">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Add New Animal
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Animal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <AnimalForm
            onSubmit={handleSubmit}
            isSubmitting={addAnimalMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddAnimal;
