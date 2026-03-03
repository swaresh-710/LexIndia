"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

import { AuthError } from "next-auth";

export async function login(prevState: any, formData: FormData) {
    try {
        await signIn("credentials", {
            ...Object.fromEntries(formData),
            redirectTo: "/dashboard",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            console.error("Auth error:", error.message);
            return { error: "Authentication failed. Check your credentials." };
        }
        // Let Next.js standard errors (like NEXT_REDIRECT) bubble up
        throw error;
    }
}

export async function register(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
        throw new Error("Missing required fields");
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw new Error("User with this email already exists");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
    } catch (error) {
        console.error("Failed to register:", error);
        throw new Error("Failed to register user");
    }

    redirect("/login");
}
