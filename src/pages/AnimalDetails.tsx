import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAnimalById, deleteAnimal } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
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
import { ArrowLeft, Pencil, Trash2, CheckCircle, AlertTriangle } from "lucide-react";
import { Animal } from "@/types";

const AnimalDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const queryClient = useQueryClient();
  
  const { data: animal, isLoading } = useQuery({
    queryKey: ["animal", id],
    queryFn: () => getAnimalById(Number(id)),
  });

  const deleteAnimalMutation = useMutation({
    mutationFn: deleteAnimal,
    onSuccess: () => {
      toast.success("Animal deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["animals"] });
      navigate("/animals");
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (id) {
      deleteAnimalMutation.mutate(Number(id));
      setIsDeleteDialogOpen(false);
    }
  };

  // Determine if buying based on the buyorsale value
  // If it's a number, we assume values < 3 are "buy" and values >= 3 are "sale"
  const isBuying = animal && (
    animal.buyorsale === "buy" || 
    (typeof animal.buyorsale === "number" && animal.buyorsale < 3)
  );

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link to="/animals">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Animal Details
        </h1>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">{animal.name}</h2>
                {isBuying ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                    Buy
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                    Sale
                  </span>
                )}
              </div>
              <p className="text-muted-foreground mt-1">Type: {isBuying ? 'Purchase' : 'Sale'}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
              <Button
                size="sm"
                className="bg-farm-green hover:bg-farm-green/90"
                asChild
              >
                <Link to={`/animals/edit/${animal.animalID}`}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Count</span>
                  <span className="font-medium">{animal.animalcount || 1}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-medium">{animal.animalPrice} $</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Status</span>
                  <span
                    className={`font-medium ${
                      isBuying ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {isBuying ? "Buy" : "Sale"}
                  </span>
                </div>
                {animal.dateOfbuyorsale && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">
                      {new Date(animal.dateOfbuyorsale).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {animal.description && (
              <div className="space-y-4">
                <h3 className="font-medium">Description</h3>
                <div className="bg-muted p-4 rounded-md text-sm">
                  {animal.description}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <strong>{animal.name}</strong> from your records.
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

export default AnimalDetails;
