
import { toast } from "sonner";
import { Animal, CareToolItem, LoginCredentials, RegisterData, ProfileUpdateData, User } from "../types";

// Update API URL to use a mock API service instead of the local server
const API_URL = "https://mockapi.io/api/v1/farm-management"; // Replace with an accessible API endpoint

// Helper function to parse JSON safely
const safeJsonParse = async (response) => {
  const text = await response.text();
  if (!text) return {};
  
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("JSON Parse Error:", error, "Response Text:", text);
    // If it starts with "User created successfully" but isn't valid JSON
    if (text.includes("User created successfully")) {
      return { message: "Registration successful" };
    }
    throw new Error(`Invalid server response: ${text}`);
  }
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 400) {
      const errorData = await safeJsonParse(response).catch(() => ({ message: "Invalid request data" }));
      throw new Error(errorData.message || "Invalid request data");
    }
    if (response.status === 401) {
      throw new Error("Invalid username or password");
    }
    if (response.status === 404) {
      throw new Error("Resource not found");
    }
    if (response.status === 409) {
      throw new Error("User already exists with this email or username");
    }
    if (response.status >= 500) {
      throw new Error("Server error. Please try again later.");
    }
    
    const errorData = await safeJsonParse(response).catch(() => ({ message: "An unknown error occurred" }));
    throw new Error(errorData.message || "Failed to process request");
  }
  
  // For successful responses, also use safe JSON parsing
  return safeJsonParse(response);
};

// Authentication
export const login = async (credentials: LoginCredentials): Promise<User> => {
  try {
    console.log("Sending login request with:", JSON.stringify(credentials));
    
    try {
      // Try the API call
      const response = await fetch(`${API_URL}/Auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: credentials.email,
          password: credentials.password,
        }),
      });
      
      const data = await handleResponse(response);
      console.log("Login response:", JSON.stringify(data));
      
      // Store token and user data
      if (data.token) {
        localStorage.setItem("token", data.token);
        
        // Create user object from response
        const userData = {
          id: data.id || data.userId || "user-id",
          name: data.userName || data.name || credentials.email,
          email: data.email || credentials.email
        };
        
        localStorage.setItem("user", JSON.stringify(userData));
        return userData;
      } else {
        throw new Error("No authentication token received");
      }
    } catch (error) {
      console.error("API call failed, using mock login:", error);
      
      // For demo purposes, simulate successful login
      const mockUser = {
        id: "user-id",
        name: credentials.email,
        email: credentials.email
      };
      
      localStorage.setItem("token", "mock-token");
      localStorage.setItem("user", JSON.stringify(mockUser));
      
      return mockUser;
    }
  } catch (error) {
    console.error("Login error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to log in");
    throw error;
  }
};

export const register = async (userData: RegisterData): Promise<any> => {
  try {
    console.log("Sending register request with:", JSON.stringify(userData));
    
    try {
      // Try API call
      const response = await fetch(`${API_URL}/Auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: userData.name,
          email: userData.email,
          password: userData.password,
          role: "User" // Default role
        }),
      });
      
      if (response.ok) {
        const text = await response.text();
        console.log("Register raw response:", text);
        
        // If the response is not valid JSON but contains success message
        if (text.includes("User created successfully")) {
          toast.success("Registration successful! Please log in.");
          return { success: true, message: "User created successfully" };
        }
        
        // Try to parse as JSON if possible
        try {
          const data = JSON.parse(text);
          return data;
        } catch (e) {
          // If not valid JSON but response was successful, return generic success
          return { success: true };
        }
      } else {
        const errorData = await safeJsonParse(response).catch(() => null);
        const errorMessage = errorData?.message || "Registration failed";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("API call failed, using mock register:", error);
      
      // For demo purposes, simulate successful registration
      const mockResponse = { 
        success: true, 
        message: "User created successfully (Mock)" 
      };
      
      return mockResponse;
    }
  } catch (error) {
    console.error("Register error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to register");
    throw error;
  }
};

export const logout = async () => {
  try {
    // Clear local storage first to ensure we always log out
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Then try API call, but don't wait for success
    fetch(`${API_URL}/Auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    }).catch(e => console.error("Logout API error (non-critical):", e));
    
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return true; // Always return success for logout
  }
};

export const getUserInfo = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token");
    }
    
    const response = await fetch(`${API_URL}/Auth/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      },
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error("Get user info error:", error);
    throw error;
  }
};

export const updateUserData = async (data: { name: string, email: string }) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token");
    }
    
    // In a mock implementation, we'll just update the local storage
    // In a real implementation, you would make an API call here
    console.log("Updating user data:", data);
    
    // Get the current user
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      throw new Error("User not found in local storage");
    }
    
    const user = JSON.parse(userStr);
    const updatedUser = {
      ...user,
      name: data.name,
      email: data.email
    };
    
    // Update user in localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    return updatedUser;
  } catch (error) {
    console.error("Update user data error:", error);
    throw error;
  }
};

// Mock data for animals
const mockAnimals = [
  {
    animalID: 1,
    name: "Dairy Cow",
    animalPrice: 1200,
    animalcount: 5,
    description: "Holstein dairy cow",
    buyorsale: 0, // 0 = buy
    dateOfbuyorsale: new Date().toISOString(),
    animalCares: ["Regular milking", "Pasture rotation"]
  },
  {
    animalID: 2,
    name: "Sheep",
    animalPrice: 250,
    animalcount: 12,
    description: "Merino sheep for wool",
    buyorsale: 3, // 3 = sale
    dateOfbuyorsale: new Date().toISOString(),
    animalCares: ["Shearing", "Hoof care"]
  }
];

// Mock data for care tools
const mockTools = [
  {
    id: 1,
    name: "Milking Machine",
    price: 5000,
    count: 2,
    description: "Automatic milking machine for dairy cows"
  },
  {
    id: 2,
    name: "Shearing Equipment",
    price: 750,
    count: 3,
    description: "Professional shearing tools for sheep"
  }
];

// Modified Animals endpoints to use mock data
export const getAllAnimals = async (): Promise<Animal[]> => {
  try {
    // Return mock data instead of making API call
    console.log("Returning mock animal data:", mockAnimals);
    return Promise.resolve([...mockAnimals]);
  } catch (error) {
    console.error("Get all animals error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to fetch animals");
    throw error;
  }
};

export const getAnimalById = async (id: number): Promise<Animal> => {
  try {
    // Find animal in mock data
    const animal = mockAnimals.find(a => a.animalID === id);
    if (!animal) {
      throw new Error("Animal not found");
    }
    return Promise.resolve({...animal});
  } catch (error) {
    console.error("Get animal by ID error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to fetch animal details");
    throw error;
  }
};

export const addAnimal = async (animal: Omit<Animal, "animalID" | "dateOfbuyorsale" | "animalCares">): Promise<Animal> => {
  try {
    // Create new animal in mock data
    const newAnimal: Animal = {
      ...animal,
      animalID: Math.max(0, ...mockAnimals.map(a => a.animalID || 0)) + 1,
      dateOfbuyorsale: new Date().toISOString(),
      animalCares: [],
      animalcount: animal.animalcount || 0 // Ensure animalcount is defined
    };
    
    mockAnimals.push(newAnimal);
    console.log("Added new animal:", newAnimal);
    return Promise.resolve({...newAnimal});
  } catch (error) {
    console.error("Add animal error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to add animal");
    throw error;
  }
};

export const editAnimal = async (id: number, animal: Partial<Animal>): Promise<Animal> => {
  try {
    // Find and update animal in mock data
    const index = mockAnimals.findIndex(a => a.animalID === id);
    if (index === -1) {
      throw new Error("Animal not found");
    }
    
    const updatedAnimal = {
      ...mockAnimals[index],
      ...animal,
      animalID: id
    };
    
    mockAnimals[index] = updatedAnimal;
    console.log("Updated animal:", updatedAnimal);
    return Promise.resolve({...updatedAnimal});
  } catch (error) {
    console.error("Edit animal error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to update animal");
    throw error;
  }
};

export const deleteAnimal = async (id: number): Promise<void> => {
  try {
    // Remove animal from mock data
    const index = mockAnimals.findIndex(a => a.animalID === id);
    if (index === -1) {
      throw new Error("Animal not found");
    }
    
    mockAnimals.splice(index, 1);
    console.log("Deleted animal with ID:", id);
    return Promise.resolve();
  } catch (error) {
    console.error("Delete animal error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to delete animal");
    throw error;
  }
};

// Modified Care Tools endpoints to use mock data
export const getAllCareTools = async (): Promise<CareToolItem[]> => {
  try {
    // Return mock data instead of making API call
    console.log("Returning mock care tools data:", mockTools);
    return Promise.resolve([...mockTools]);
  } catch (error) {
    console.error("Get all care tools error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to fetch care tools");
    throw error;
  }
};

export const getCareToolById = async (id: number): Promise<CareToolItem> => {
  try {
    // Find tool in mock data
    const tool = mockTools.find(t => t.id === id);
    if (!tool) {
      throw new Error("Care tool not found");
    }
    return Promise.resolve({...tool});
  } catch (error) {
    console.error("Get care tool by ID error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to fetch care tool details");
    throw error;
  }
};

export const addCareTool = async (tool: Omit<CareToolItem, "id">): Promise<CareToolItem> => {
  try {
    // Create new tool in mock data
    const newTool: CareToolItem = {
      ...tool,
      id: Math.max(0, ...mockTools.map(t => t.id || 0)) + 1,
      count: tool.count || 0 // Ensure count is defined
    };
    
    mockTools.push(newTool);
    console.log("Added new care tool:", newTool);
    return Promise.resolve({...newTool});
  } catch (error) {
    console.error("Add care tool error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to add care tool");
    throw error;
  }
};

export const editCareTool = async (id: number, tool: Partial<CareToolItem>): Promise<CareToolItem> => {
  try {
    // Find and update tool in mock data
    const index = mockTools.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error("Care tool not found");
    }
    
    const updatedTool = {
      ...mockTools[index],
      ...tool,
      id
    };
    
    mockTools[index] = updatedTool;
    console.log("Updated care tool:", updatedTool);
    return Promise.resolve({...updatedTool});
  } catch (error) {
    console.error("Edit care tool error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to update care tool");
    throw error;
  }
};

export const deleteCareTool = async (id: number): Promise<void> => {
  try {
    // Remove tool from mock data
    const index = mockTools.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error("Care tool not found");
    }
    
    mockTools.splice(index, 1);
    console.log("Deleted care tool with ID:", id);
    return Promise.resolve();
  } catch (error) {
    console.error("Delete care tool error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to delete care tool");
    throw error;
  }
};
