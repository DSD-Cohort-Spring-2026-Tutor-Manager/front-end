import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email === "parent@example.com" && password === "123456") {
    return NextResponse.json({
      name: "Samantha Villanueva",
      avatar: "/images/worm_with_glasses.png",
    });
  }
  if (email === "tutor@example.com" && password === "123456") {
    return NextResponse.json({
      name: "Tortoise Tutor",
      avatar: "/images/worm_with_glasses.png",
    });
  }

  return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
}
