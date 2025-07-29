import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "./mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

// Extend the built-in session types
declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			email: string;
			name: string;
			image?: string;
		};
	}

	interface User {
		id: string;
		email: string;
		name: string;
		image?: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		email: string;
		name: string;
		image?: string;
	}
}

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				try {
					await connectDB();
					const user = await User.findOne({ email: credentials.email });

					if (!user || !user.password) {
						return null;
					}

					const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

					if (!isPasswordValid) {
						return null;
					}

					return {
						id: user._id.toString(),
						email: user.email,
						name: user.name,
						image: user.image,
					};
				} catch (error) {
					console.error("Auth error:", error);
					return null;
				}
			},
		}),
	],
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/auth/signin",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.email = user.email;
				token.name = user.name;
				token.image = user.image;
			}
			return token;
		},
		async session({ session, token }) {
			if (token && session.user) {
				session.user.id = token.id;
				session.user.email = token.email;
				session.user.name = token.name;
				session.user.image = token.image;
			}
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
};
