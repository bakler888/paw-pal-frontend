
import { toast } from "sonner";

const API_URL = "https://localhost:7227/api"; // Update this with your actual API URL

interface LoginRequest {
  userName: string; 
  password: string;
}

interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  role?: string;
}

// Updated Animal interface to match the DTO
interface Animal {
  animalID: number;
  name: string;
  animalPrice: number;
  animalcount: number;
  description?: string;
  buyorsale: string | number; // Accepting both string and number for flexibility
  dateOfbuyorsale: string;
  animalCares: string[];
}

// Updated CareToolItem interface to match the DTO
interface CareToolItem {
  id?: number; // Optional for new items
  name: string;
  price: number;
  count: number;
  description?: string;
}

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
export const login = async (credentials: { email: string, password: string }) => {
  try {
    // Convert the incoming email/password format to the userName/password format expected by the API
    const loginRequest: LoginRequest = {
      userName: credentials.email, // Using email as userName
      password: credentials.password,
    };
    
    console.log("Sending login request with:", JSON.stringify(loginRequest));
    
    const response = await fetch(`${API_URL}/Auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginRequest),
    });
    
    const data = await handleResponse(response);
    console.log("Login response:", JSON.stringify(data));
    
    // Store token and user data
    if (data.token) {
      localStorage.setItem("token", data.token);
      
      // Create user object from response
      const userData = {
        id: data.id || data.userId || "user-id",
        name: data.userName || data.name || loginRequest.userName,
        email: data.email || loginRequest.userName
      };
      
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } else {
      throw new Error("No authentication token received");
    }
  } catch (error) {
    console.error("Login error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to log in");
    throw error;
  }
};

export const register = async (userData: { name: string, email: string, password: string }) => {
  try {
    // Convert to your API's expected format
    const registerRequest: RegisterRequest = {
      userName: userData.name,
      email: userData.email,
      password: userData.password,
      role: "User" // Default role
    };
    
    console.log("Sending register request with:", JSON.stringify(registerRequest));
    
    const response = await fetch(`${API_URL}/Auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerRequest),
    });
    
    // Handle non-JSON responses from registration endpoint
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

// Animals - Updated endpoints
export const getAllAnimals = async (): Promise<Animal[]> => {
  try {
    const response = await fetch(`${API_URL}/Animals/GetAllAnimals`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error("Get all animals error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to fetch animals");
    throw error;
  }
};

export const getAnimalById = async (id: number): Promise<Animal> => {
  try {
    const response = await fetch(`${API_URL}/Animals/GetAnimalById?id=${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error("Get animal by ID error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to fetch animal details");
    throw error;
  }
};

export const addAnimal = async (animal: Omit<Animal, "animalID" | "dateOfbuyorsale" | "animalCares">): Promise<Animal> => {
  try {
    // Set the dateOfbuyorsale to current date if not provided
    const animalData = {
      ...animal,
      dateOfbuyorsale: new Date().toISOString(),
      animalCares: [] // Initialize empty animalCares array
    };
    
    const response = await fetch(`${API_URL}/Animals/AddAnimal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(animalData),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error("Add animal error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to add animal");
    throw error;
  }
};

export const editAnimal = async (id: number, animal: Partial<Animal>): Promise<Animal> => {
  try {
    // For PUT requests, we need to include the ID
    const animalData = {
      animalID: id,
      ...animal
    };
    
    const response = await fetch(`${API_URL}/Animals/EditAnimal`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(animalData),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error("Edit animal error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to update animal");
    throw error;
  }
};

export const deleteAnimal = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/Animals/DeleteAnimal?id=${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    });
    
    await handleResponse(response);
  } catch (error) {
    console.error("Delete animal error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to delete animal");
    throw error;
  }
};

// Care Tools - Updated endpoints
export const getAllCareTools = async (): Promise<CareToolItem[]> => {
  try {
    const response = await fetch(`${API_URL}/Care/GetAllCareTools`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error("Get all care tools error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to fetch care tools");
    throw error;
  }
};

export const getCareToolById = async (id: number): Promise<CareToolItem> => {
  try {
    const response = await fetch(`${API_URL}/Care/GetToolById?id=${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error("Get care tool by ID error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to fetch care tool details");
    throw error;
  }
};

export const addCareTool = async (tool: Omit<CareToolItem, "id">): Promise<CareToolItem> => {
  try {
    const response = await fetch(`${API_URL}/Care/AddTool`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(tool),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error("Add care tool error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to add care tool");
    throw error;
  }
};

export const editCareTool = async (id: number, tool: Partial<CareToolItem>): Promise<CareToolItem> => {
  try {
    // For PUT requests, we need to include the ID
    const toolData = {
      id,
      ...tool
    };
    
    const response = await fetch(`${API_URL}/Care/UpdateTool`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(toolData),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error("Edit care tool error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to update care tool");
    throw error;
  }
};

export const deleteCareTool = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/Care/DeleteTool?id=${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    });
    
    await handleResponse(response);
  } catch (error) {
    console.error("Delete care tool error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to delete care tool");
    throw error;
  }
};
