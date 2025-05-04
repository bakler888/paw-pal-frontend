
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm py-4 border-b">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
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
              className="h-8 w-8 text-farm-green mr-2"
            >
              <path d="M3 9a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-9z" />
              <path d="M9 16h6" />
              <path d="M13 9a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-9z" />
              <path d="M8 7v-4" />
              <path d="M18 7v-4" />
            </svg>
            <h1 className="text-2xl font-bold text-farm-green">FarmCare</h1>
          </div>
          <div>
            {isAuthenticated ? (
              <Button className="bg-farm-green hover:bg-farm-green/90">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <div className="flex gap-4">
                <Button variant="outline" className="border-farm-green text-farm-green hover:bg-farm-green/10">
                  <Link to="/login">Login</Link>
                </Button>
                <Button className="bg-farm-green hover:bg-farm-green/90">
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-20 px-4 bg-background farm-pattern">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-farm-green mb-6">
              Manage Your Farm With Ease
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              FarmCare helps you manage your animals and care tools efficiently,
              providing everything you need to run your farm operations smoothly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Button size="lg" className="bg-farm-green hover:bg-farm-green/90">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="bg-farm-green hover:bg-farm-green/90"
                  >
                    <Link to="/register">Get Started</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-farm-green text-farm-green hover:bg-farm-green/10"
                  >
                    <Link to="/login">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h3 className="text-3xl font-bold text-center text-farm-green mb-12">
              Key Features
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-farm-green/10 text-farm-green mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.5 2.5c0 2.5-2.5 2.5-2.5 5 0 1.7 1.3 3 3 3s3-1.3 3-3c0-2.5-2.5-2.5-2.5-5C11.5 1.7 10.2 0 8.5 0S5.5 1.7 5.5 2.5c0 2.5 2.5 2.5 2.5 5 0 1.7 1.3 3 3 3s3-1.3 3-3" />
                    <path d="M16 8c-1.9 0-3 1.3-3 3.5S14.1 15 16 15s3-1.3 3-3.5S17.9 8 16 8z" />
                    <path d="M3 14c3 -2 4 -3 4 -6" />
                    <path d="M18 9a3 3 0 0 0 -3 -3" />
                    <path d="M18 15v7" />
                    <path d="M21 15v7" />
                    <path d="M18 19h6" />
                    <path d="M3 14v7" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-2 text-farm-green">Animal Management</h4>
                <p className="text-gray-600">
                  Track and manage all your animals' details including breed, health status, and more.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-farm-green/10 text-farm-green mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 10h3V3L7 10zM14 10h3V3l-3 7zM14 21l3-7h-3zM7 21l3-7H7z" />
                    <path d="M4 10h16" />
                    <path d="M16 10c0 1.1.9 2 2 2a2 2 0 002-2 2 2 0 00-2-2 2 2 0 00-2 2zM4 10c0 1.1.9 2 2 2a2 2 0 002-2 2 2 0 00-2-2 2 2 0 00-2 2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-2 text-farm-green">Care Tools Inventory</h4>
                <p className="text-gray-600">
                  Keep track of all your farming tools, their condition, and maintenance schedules.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-farm-green/10 text-farm-green mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18" />
                    <path d="M18 9l-6-6-6 6" />
                    <path d="M6 9v4" />
                    <path d="M12 3v10" />
                    <path d="M18 9v6" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-2 text-farm-green">Reports & Analytics</h4>
                <p className="text-gray-600">
                  Get insights into your farm's performance with detailed reports and analytics.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
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
                className="h-6 w-6 text-farm-green mr-2"
              >
                <path d="M3 9a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-9z" />
                <path d="M9 16h6" />
                <path d="M13 9a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-9z" />
                <path d="M8 7v-4" />
                <path d="M18 7v-4" />
              </svg>
              <span className="text-gray-600">FarmCare</span>
            </div>
            <div>
              <p className="text-gray-600 text-sm">
                &copy; {new Date().getFullYear()} FarmCare. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
