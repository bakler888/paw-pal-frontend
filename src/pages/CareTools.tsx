
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCareTools, deleteCareTool } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ToolCard from "@/components/ToolCard";
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

const CareTools = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [toolToDelete, setToolToDelete] = useState<number | null>(null);

  const queryClient = useQueryClient();
  
  const { data: tools, isLoading } = useQuery({
    queryKey: ["careTools"],
    queryFn: getAllCareTools,
  });

  const deleteToolMutation = useMutation({
    mutationFn: deleteCareTool,
    onSuccess: () => {
      toast.success("Care tool deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["careTools"] });
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleDeleteTool = (id: number) => {
    setToolToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (toolToDelete) {
      deleteToolMutation.mutate(toolToDelete);
      setIsDeleteDialogOpen(false);
      setToolToDelete(null);
    }
  };

  const filteredTools = tools?.filter((tool) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      tool.name.toLowerCase().includes(searchTermLower) ||
      tool.purpose.toLowerCase().includes(searchTermLower) ||
      tool.condition.toLowerCase().includes(searchTermLower)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Care Tools
        </h1>
        <Button className="bg-farm-brown hover:bg-farm-brown/90">
          <Plus className="h-4 w-4 mr-2" />
          <Link to="/care-tools/add">Add Tool</Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search care tools..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="loader"></div>
        </div>
      ) : filteredTools && filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onDelete={handleDeleteTool}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "No care tools match your search"
              : "No care tools added yet"}
          </p>
          {!searchTerm && (
            <Button className="bg-farm-brown hover:bg-farm-brown/90">
              <Link to="/care-tools/add">Add your first care tool</Link>
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
              care tool from your inventory.
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

export default CareTools;
