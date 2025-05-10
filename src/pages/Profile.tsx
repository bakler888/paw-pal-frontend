
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
      
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-4 border-background">
              <AvatarFallback className="bg-farm-green text-white text-xl">
                {user?.name?.charAt(0).toUpperCase() || <User />}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{user?.name || "User"}</CardTitle>
              <CardDescription>{user?.email || "No email provided"}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-2">User Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="font-medium">{user?.name || "Not set"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email || "Not set"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">User ID</p>
                <p className="font-medium">{user?.id || "Not available"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
