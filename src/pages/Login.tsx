
import React from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const Login = () => {
  const { login, isLoading } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login({
        email: values.email,
        password: values.password
      });
    } catch (error) {
      console.error("Login failed:", error);
      // Error is handled by API service
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background farm-pattern px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <div className="text-center">
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-10 w-10 text-farm-green"
              >
                <path d="M3 9a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-9z" />
                <path d="M9 16h6" />
                <path d="M13 9a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-9z" />
                <path d="M8 7v-4" />
                <path d="M18 7v-4" />
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-farm-green">FarmCare Login</h2>
            <p className="mt-2 text-gray-500">Sign in to manage your farm</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-farm-green hover:bg-farm-green/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="loader mr-2"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>

              <div className="text-center text-sm">
                <p>
                  Don't have an account?{" "}
                  <Link to="/register" className="text-farm-green hover:underline">
                    Register
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
