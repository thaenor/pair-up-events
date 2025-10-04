import { AuthContextType } from "@/lib/firebase/types";
import { createContext } from "react";

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);