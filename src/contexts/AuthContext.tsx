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
    console.log("Setting up auth state listener");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check if user is admin when session changes
        if (session?.user) {
          console.log("Checking admin status for user:", session.user.email);
          await checkUserRole(session.user);
        } else {
          console.log("No user session, resetting admin status");
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          setLoading(false);
          return;
        }

        console.log("Initial session check:", session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await checkUserRole(session.user);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error initializing auth:", error);
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUserRole = async (authUser: User) => {
    try {
      console.log("Checking user role for:", authUser.email);
      
      // Define admin emails
      const adminEmails = [
        'admin@example.com', 
        'admin@inddistribution.com',
        'admin@mdi.in',
        'Admin@mdi.in', // The exact admin email provided
        'summyji07@gmail.com' // Development admin
      ];
      
      const userEmail = authUser.email?.toLowerCase() || '';
      const isUserAdmin = adminEmails.some(email => 
        email.toLowerCase() === userEmail || email === authUser.email
      );
      
      if (isUserAdmin) {
        setIsAdmin(true);
        console.log("✅ Admin access granted for:", authUser.email);
      } else {
        setIsAdmin(false);
        console.log("👤 Regular user access for:", authUser.email);
      }
      
    } catch (error) {
      console.error("Error checking user role:", error);
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("🔐 Sign in attempt for:", email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error("❌ Sign in error:", error);
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      if (data.user) {
        console.log("✅ Sign in successful for:", email);
        
        // Check admin status immediately
        await checkUserRole(data.user);
        
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
      }
      
      return { error: null };
    } catch (error: any) {
      console.error("💥 Sign in exception:", error);
      toast({
        title: "Login Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
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
    console.log("🚪 Signing out user");
    try {
      await supabase.auth.signOut();
      setIsAdmin(false);
      setUser(null);
      setSession(null);
      navigate("/login");
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
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
