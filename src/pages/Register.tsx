
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

const registerFormSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerFormSchema>;

const Register = () => {
  const { register: registerUser, isLoading } = useAuth();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password
      });
    } catch (error) {
      console.error("Registration failed:", error);
      // Error is handled by API service
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background farm-pattern px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 border-2 border-farm-green/20">
          <div className="text-center">
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-14 w-14 text-farm-green"
              >
                <path d="M3 9a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-9z" />
                <path d="M9 16h6" />
                <path d="M13 9a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-9z" />
                <path d="M8 7v-4" />
                <path d="M18 7v-4" />
              </svg>
            </div>
            <h2 className="mt-4 text-3xl font-bold text-farm-green">Create Account</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400 font-medium">Sign up to start managing your farm</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John Doe" 
                          {...field} 
                          className="border-2 border-farm-green/20 focus:border-farm-green/50 bg-white dark:bg-gray-900"
                        />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="email@example.com" 
                          {...field} 
                          className="border-2 border-farm-green/20 focus:border-farm-green/50 bg-white dark:bg-gray-900"
                        />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••" 
                          {...field} 
                          className="border-2 border-farm-green/20 focus:border-farm-green/50 bg-white dark:bg-gray-900"
                        />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••" 
                          {...field} 
                          className="border-2 border-farm-green/20 focus:border-farm-green/50 bg-white dark:bg-gray-900"
                        />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-farm-green hover:bg-farm-green/90 text-white font-bold py-3 shadow-md hover:shadow-lg transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="loader mr-2"></div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  "Register"
                )}
              </Button>

              <div className="text-center text-sm mt-4">
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="text-farm-green font-bold hover:underline">
                    Sign in
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

export default Register;
