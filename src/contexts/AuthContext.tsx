
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any, user: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, user: null }),
  signOut: async () => {},
  isAdmin: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state change:", event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Check if user is admin
        if (session?.user) {
          setTimeout(() => {
            checkUserRole(session.user);
          }, 0);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkUserRole(session.user);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUserRole = async (authUser: User) => {
    try {
      console.log("Checking user role for:", authUser.email);
      
      // Enhanced admin email checking with multiple domains
      const adminEmails = [
        'admin@example.com', 
        'admin@inddistribution.com',
        'admin@mdi.in',
        'Admin@mdi.in', // The exact admin email provided
        'summyji07@gmail.com' // Development admin
      ];
      
      if (authUser && adminEmails.includes(authUser.email || '')) {
        setIsAdmin(true);
        console.log("Admin access granted for:", authUser.email);
      } else {
        setIsAdmin(false);
        console.log("Regular user access for:", authUser.email);
      }
      
      // Once your database tables are properly set up, you can uncomment this code:
      /*
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authUser.id)
        .eq('role', 'admin')
        .single();
      
      if (data && !error) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      */
    } catch (error) {
      console.error("Error checking user role:", error);
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Sign in attempt for:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      console.log("Sign in successful for:", email);
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      
      return { error: null };
    } catch (error: any) {
      console.error("Sign in exception:", error);
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) {
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error, user: null };
      }

      toast({
        title: "Registration Successful",
        description: "Welcome to IND Distribution!",
      });
      
      return { error: null, user: data.user };
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
      return { error, user: null };
    }
  };

  const signOut = async () => {
    console.log("Signing out user");
    await supabase.auth.signOut();
    setIsAdmin(false);
    navigate("/login");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
