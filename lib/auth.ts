import NextAuth, { NextAuthOptions } from "next-auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/user.models";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: ""},
                password: { label: "Password", type: "password", placeholder: "" }
            },
            async authorize(credentials, req) {
                if(!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }
                
                try{
                    await connectToDatabase();
                    const user = await User.findOne({ email: credentials.email });
                    if(!user) {
                        throw new Error("User not found");
                    }
                    
                    const isValid = await bcrypt.compare(credentials.password, user.password)
                    if(!isValid) {
                        throw new Error("Invalid password");
                    }
                    // If everything is fine, return the user object
                    // You can return any user object you want, but it should have an id and email
                    return { id: user._id, email: user.email };
                }
                
                catch (error) {
                    console.error("Authorization error:", error);
                    throw new Error("Internal server error");            
                }
                
            }
        }
    )
],
callbacks: {
    async jwt({ token, user }) {
        if (user) {
            token.id = user.id; // Add user ID to the token
        }
        return token;
    },
    async session({ session, token }) {
        if (token) {
            session.user.id = token.id as string; // Add user ID to the session
        }
        return session;
    }
},
pages: {
    signIn: "login",
    error: "/login", // Error code passed in query string as ?error=
},
session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60
},
secret: process.env.NEXTAUTH_SECRET, 
}