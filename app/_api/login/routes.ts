import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email === "parentno1@email.com" && password === "password123") {
    return NextResponse.json({
      name: "Samantha Villanueva",
      avatar: "/images/worm_with_glasses.png",
    });
  }
  if (email === "tutor1no1@email.com" && password === "password123") {
    return NextResponse.json({
      name: "Tortoise Tutor",
      avatar: "/images/worm_with_glasses.png",
    });
  }
  if (email === "john.admin@email.com" && password === "password123") {
    return NextResponse.json({
      name: "Admin",
      avatar: "/images/worm_with_glasses.png",
    });
  }

  return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
}
