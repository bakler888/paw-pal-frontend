
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAnimalById, editAnimal } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import AnimalForm from "@/components/AnimalForm";
import { ArrowLeft } from "lucide-react";

const EditAnimal = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: animal, isLoading } = useQuery({
    queryKey: ["animal", id],
    queryFn: () => getAnimalById(Number(id)),
  });

  const editAnimalMutation = useMutation({
    mutationFn: (animalData: any) => editAnimal(Number(id), animalData),
    onSuccess: () => {
      toast.success("Animal updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["animals"] });
      queryClient.invalidateQueries({ queryKey: ["animal", id] });
      navigate(`/animals/${id}`);
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleSubmit = (values: any) => {
    editAnimalMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="loader"></div>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Animal not found</p>
        <Button>
          <Link to="/animals">Back to Animals</Link>
        </Button>
      </div>
    );
  }

  // Extract the relevant fields from the animal data for the form
  const animalFormData = {
    name: animal.name,
    animalPrice: animal.animalPrice,
    animalcount: animal.animalcount,
    description: animal.description,
    buyorsale: animal.buyorsale,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link to={`/animals/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Edit Animal
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{animal.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <AnimalForm
            initialValues={animalFormData}
            onSubmit={handleSubmit}
            isSubmitting={editAnimalMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditAnimal;
