
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCareTool } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolForm from "@/components/ToolForm";
import { ArrowLeft } from "lucide-react";

const AddTool = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const addToolMutation = useMutation({
    mutationFn: (toolData: any) => addCareTool(toolData),
    onSuccess: () => {
      toast.success("Care tool added successfully!");
      queryClient.invalidateQueries({ queryKey: ["careTools"] });
      navigate("/care-tools");
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleSubmit = (values: any) => {
    addToolMutation.mutate(values);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link to="/care-tools">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Add New Care Tool
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tool Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ToolForm
            onSubmit={handleSubmit}
            isSubmitting={addToolMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTool;
