import { AuthContext } from "@/contexts/auth-context";
import { useContext } from "react";

export function useAuth() {
  const value = useContext(AuthContext)

  return value
}