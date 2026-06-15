"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { APP_CONFIG } from "@/lib/constants";

export async function login(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const res = await fetch(`${APP_CONFIG.API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || "Invalid credentials" };
    }

    const cookieStore = await cookies();
    cookieStore.set("token", data.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    cookieStore.set("userName", data.data.user.name, { path: "/", maxAge: 60 * 60 * 24 * 7 });
    cookieStore.set("userEmail", data.data.user.email, { path: "/", maxAge: 60 * 60 * 24 * 7 });

    return { success: true };
  } catch (err) {
    return { error: "An error occurred while logging in." };
  }
}

export async function signup(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (!name || !email || !password) {
    return { error: "Name, email, and password are required" };
  }

  try {
    const res = await fetch(`${APP_CONFIG.API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || "Failed to sign up" };
    }

    const cookieStore = await cookies();
    cookieStore.set("token", data.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    cookieStore.set("userName", data.data.user.name, { path: "/", maxAge: 60 * 60 * 24 * 7 });
    cookieStore.set("userEmail", data.data.user.email, { path: "/", maxAge: 60 * 60 * 24 * 7 });

    return { success: true };
  } catch (err) {
    return { error: "An error occurred while signing up." };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("userName");
  cookieStore.delete("userEmail");
  redirect("/login");
}
