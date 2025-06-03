
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
    console.log("🔧 Setting up auth state listener");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔄 Auth state change:", event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await checkUserRole(session.user);
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("❌ Error getting session:", error);
          setLoading(false);
          return;
        }

        console.log("🔍 Initial session check:", session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await checkUserRole(session.user);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("💥 Error initializing auth:", error);
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
      console.log("🔍 Checking user role for:", authUser.email);
      
      const { data: userRole, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authUser.id)
        .eq('role', 'admin')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("❌ Error checking user role:", error);
        setIsAdmin(false);
        return;
      }

      const isUserAdmin = userRole?.role === 'admin';
      setIsAdmin(isUserAdmin);
      
      console.log(isUserAdmin ? "✅ Admin access granted" : "👤 Regular user access");
      
    } catch (error) {
      console.error("💥 Error checking user role:", error);
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("🔐 Sign in attempt for:", email);
      setLoading(true);
      
      // Check if this is the admin login
      if (email === 'Admin@mdi.in' && password === '11111111') {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (signInError && signInError.message.includes('Invalid login credentials')) {
          console.log("🔧 Admin user not found, creating admin account...");
          
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: email.trim(),
            password: password.trim(),
            options: {
              data: { full_name: 'Admin User' }
            }
          });

          if (signUpError) {
            console.error("❌ Admin account creation error:", signUpError);
            toast({
              title: "Account Creation Failed",
              description: signUpError.message,
              variant: "destructive",
            });
            return { error: signUpError };
          }

          if (signUpData.user) {
            await supabase
              .from('user_roles')
              .insert({ user_id: signUpData.user.id, role: 'admin' });

            console.log("✅ Admin account created successfully");
            toast({
              title: "Admin Account Created",
              description: "Admin account has been set up successfully!",
            });
            
            const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
              email: email.trim(),
              password: password.trim(),
            });

            if (retryError) {
              return { error: retryError };
            }

            await checkUserRole(retryData.user!);
            return { error: null };
          }
        } else if (!signInError && data.user) {
          console.log("✅ Admin sign in successful");
          await checkUserRole(data.user);
          toast({
            title: "Welcome Admin",
            description: "Admin login successful!",
          });
          return { error: null };
        } else {
          return { error: signInError };
        }
      }

      // Regular user login
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
      navigate("/");
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("❌ Error signing out:", error);
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
