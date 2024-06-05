import { ReactNode, createContext, useEffect, useState } from "react";

import { UserProps, users } from "@/utils/mock";
import { toast } from "sonner";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextData {
  handleOtpChangeCreateOrder: (value: string, pathname: string) => void;
  handleOtpChangeOrders: (value: string, pathname: string) => void
  user: UserProps;
  setUser: (user: UserProps) => void;
  otp: string;
  setOtp: (otp: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [otp, setOtp] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState<UserProps>({} as any);

  const passwords = users.map((user) => user.passwd)

  const serviceControlAuthentication = JSON.parse(String(localStorage.getItem("@serviceControl:authentication")))
  
  function handleOtpChangeCreateOrder(value: string, pathname: string) {
    setOtp(value);
    if (value.length === 6) {
      const user = users.find(user => user.passwd === value)

      if (user) {
        if (user.role === 'attendant') {
          const auth = passwords.filter((pass) => value === pass)
          const isValidPassword = auth.length > 0;

          if (isValidPassword) {
            localStorage.setItem("@serviceControl:authentication", JSON.stringify({
              userId: user.id,
              pathname: pathname
            }))
            setIsOpen(false);
            toast.success("Autenticação concluída")
          } else {
            toast.error("Autenticação falhou")
          }
        } else {
          toast.error("Você não tem permissão para acessar esta tela")
        }
      } else {
        toast.error("Autenticação falhou")
      }
    }
  };

  function handleOtpChangeOrders(value: string, pathname: string) {
    setOtp(value);
    if (value.length === 6) {
      const user = users.find(user => user.passwd === value)

      if (user) {
        const auth = passwords.filter((pass) => value === pass)
        const isValidPassword = auth.length > 0;

        if (isValidPassword) {
          setIsOpen(false);
          localStorage.setItem("@serviceControl:authentication", JSON.stringify({
            userId: user.id,
            pathname: pathname
          }))
          toast.success("Autenticação concluída")
        } else {
          toast.error("Autenticação falhou")
        }

      } else {
        toast.error("Autenticação falhou")
      }
    }
  };

  useEffect(() => {
    if (serviceControlAuthentication) {
      const findUser = users.find(user => user.id === serviceControlAuthentication.userId)
      const currentPathname = window.location.pathname

      if (currentPathname === serviceControlAuthentication.pathname) {
        if (findUser) {
          setIsOpen(false)
        } else {
          setIsOpen(true)
        }
      } else {
        setIsOpen(true)
      }
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        handleOtpChangeCreateOrder,
        handleOtpChangeOrders,
        user,
        setUser,
        otp,
        setOtp,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}