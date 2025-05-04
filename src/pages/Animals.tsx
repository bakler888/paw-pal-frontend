
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllAnimals, deleteAnimal } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import AnimalCard from "@/components/AnimalCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search } from "lucide-react";

interface Animal {
  id: number;
  name: string;
  breed: string;
  age: number;
  weight: number;
  healthStatus: string;
  notes?: string;
}

const Animals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [animalToDelete, setAnimalToDelete] = useState<number | null>(null);

  const queryClient = useQueryClient();
  
  const { data: animals, isLoading } = useQuery({
    queryKey: ["animals"],
    queryFn: getAllAnimals,
  });

  const deleteAnimalMutation = useMutation({
    mutationFn: deleteAnimal,
    onSuccess: () => {
      toast.success("Animal deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["animals"] });
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleDeleteAnimal = (id: number) => {
    setAnimalToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (animalToDelete) {
      deleteAnimalMutation.mutate(animalToDelete);
      setIsDeleteDialogOpen(false);
      setAnimalToDelete(null);
    }
  };

  const filteredAnimals = animals?.filter((animal) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      animal.name.toLowerCase().includes(searchTermLower) ||
      animal.breed.toLowerCase().includes(searchTermLower) ||
      animal.healthStatus.toLowerCase().includes(searchTermLower)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Animals
        </h1>
        <Button className="bg-farm-green hover:bg-farm-green/90">
          <Plus className="h-4 w-4 mr-2" />
          <Link to="/animals/add">Add Animal</Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search animals..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="loader"></div>
        </div>
      ) : filteredAnimals && filteredAnimals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnimals.map((animal) => (
            <AnimalCard
              key={animal.id}
              animal={animal}
              onDelete={handleDeleteAnimal}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "No animals match your search"
              : "No animals added yet"}
          </p>
          {!searchTerm && (
            <Button className="bg-farm-green hover:bg-farm-green/90">
              <Link to="/animals/add">Add your first animal</Link>
            </Button>
          )}
        </div>
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              animal from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Animals;
