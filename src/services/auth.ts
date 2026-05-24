import { supabase } from "./supabase";

export const loginWithGoogle = async () => {
  return await supabase.auth.signInWithOAuth({
    provider: "google",
  });
};

export const loginWithEmailLink = async (email: string) => {
  return await supabase.auth.signInWithOtp({
    email,
  });
};

export const registerWithEmail = async (email: string, password: string) => {
  return await supabase.auth.signUp({
    email,
    password,
  });
};