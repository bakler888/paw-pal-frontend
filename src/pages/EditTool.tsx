
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCareToolById, editCareTool } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolForm from "@/components/ToolForm";
import { ArrowLeft } from "lucide-react";

const EditTool = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: tool, isLoading } = useQuery({
    queryKey: ["careTool", id],
    queryFn: () => getCareToolById(Number(id)),
  });

  const editToolMutation = useMutation({
    mutationFn: (toolData: any) => editCareTool(Number(id), toolData),
    onSuccess: () => {
      toast.success("Care tool updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["careTools"] });
      queryClient.invalidateQueries({ queryKey: ["careTool", id] });
      navigate(`/care-tools/${id}`);
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleSubmit = (values: any) => {
    editToolMutation.mutate(values);
  };

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
          <Link to={`/care-tools/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Edit Tool
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{tool.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <ToolForm
            initialValues={tool}
            onSubmit={handleSubmit}
            isSubmitting={editToolMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditTool;
