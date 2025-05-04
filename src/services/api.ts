
import { toast } from "sonner";

const API_URL = "http://localhost:5000"; // Update this with your actual API URL

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface Animal {
  id: number;
  name: string;
  breed: string;
  age: number;
  weight: number;
  healthStatus: string;
  notes?: string;
}

interface CareToolItem {
  id: number;
  name: string;
  purpose: string;
  quantity: number;
  purchaseDate: string;
  condition: string;
  notes?: string;
}

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "An unknown error occurred" }));
    throw new Error(errorData.message || "Failed to process request");
  }
  return response.json();
};

// Authentication
export const login = async (credentials: LoginRequest) => {
  try {
    const response = await fetch(`${API_URL}/Authentication/Login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await handleResponse(response);
    // Store token
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  } catch (error) {
    console.error("Login error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to log in");
    throw error;
  }
};

export const register = async (userData: RegisterRequest) => {
  try {
    const response = await fetch(`${API_URL}/Authentication/Register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error("Register error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to register");
    throw error;
  }
};

export const logout = async () => {
  try {
    await fetch(`${API_URL}/Authentication/LogOut`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    });
    
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    // Still remove token and user from local storage even if API call fails
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return true;
  }
};

export const getUserInfo = async () => {
  try {
    const response = await fetch(`${API_URL}/Authentication/ShowMe`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error("Get user info error:", error);
    toast.error(error instanceof Error ? error.message : "Failed to get user information");
    throw error;
  }
};

// Animals
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
    const response = await fetch(`${API_URL}/Animals/getAnimalById/${id}`, {
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

export const addAnimal = async (animal: Omit<Animal, "id">): Promise<Animal> => {
  try {
    const response = await fetch(`${API_URL}/Animals/AddAnimal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(animal),
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
    const response = await fetch(`${API_URL}/Animals/EditAnimal/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(animal),
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
    const response = await fetch(`${API_URL}/Animals/DeleteAnimal/${id}`, {
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

// Care Tools
export const getAllCareTools = async (): Promise<CareToolItem[]> => {
  try {
    const response = await fetch(`${API_URL}/CareTools/GetAllTools`, {
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
    const response = await fetch(`${API_URL}/CareTools/GetToolById/${id}`, {
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
    const response = await fetch(`${API_URL}/CareTools/AddTool`, {
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
    const response = await fetch(`${API_URL}/CareTools/EditTool/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(tool),
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
    const response = await fetch(`${API_URL}/CareTools/deleteTool/${id}`, {
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
