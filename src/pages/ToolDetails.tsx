
import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCareToolById, deleteCareTool } from "@/services/api";
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
import { ArrowLeft, Pencil, Trash2, CheckCircle, AlertCircle } from "lucide-react";

const ToolDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const queryClient = useQueryClient();
  
  const { data: tool, isLoading } = useQuery({
    queryKey: ["careTool", id],
    queryFn: () => getCareToolById(Number(id)),
  });

  const deleteToolMutation = useMutation({
    mutationFn: deleteCareTool,
    onSuccess: () => {
      toast.success("Care tool deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["careTools"] });
      navigate("/care-tools");
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
      deleteToolMutation.mutate(Number(id));
      setIsDeleteDialogOpen(false);
    }
  };

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const isGoodCondition = tool?.condition.toLowerCase() === "good";

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="loader"></div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Care tool not found</p>
        <Button>
          <Link to="/care-tools">Back to Care Tools</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link to="/care-tools">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tool Details
        </h1>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">{tool.name}</h2>
                {isGoodCondition ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                    Good Condition
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                    {tool.condition}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground mt-1">{tool.purpose}</p>
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
                className="bg-farm-brown hover:bg-farm-brown/90"
                asChild
              >
                <Link to={`/care-tools/edit/${tool.id}`}>
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
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="font-medium">{tool.quantity}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Purchase Date</span>
                  <span className="font-medium">{formatDate(tool.purchaseDate)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Condition</span>
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

            {tool.notes && (
              <div className="space-y-4">
                <h3 className="font-medium">Notes</h3>
                <div className="bg-muted p-4 rounded-md text-sm">
                  {tool.notes}
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
              <strong>{tool.name}</strong> from your inventory.
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

export default ToolDetails;
