import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/database";
import { sendVerificationMail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: Request) {
  const logPrefix = "[AUTH_SIGNUP_API]";

  try {
    const body = await req.json();
    const { email, password, fullName, phone } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          error: { code: "VALIDATION_ERROR", message: "Email, password, and full name are required." },
        },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const cleanPhone = phone ? phone.trim() : null;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 409,
          error: {
            code: "EMAIL_EXISTS",
            message: "An account with this email address already exists. Please log in instead.",
          },
        },
        { status: 409 }
      );
    }

    // Step 1: Find or create the customer role
    let customerRole = await prisma.role.findUnique({
      where: { name: "customer" }
    });
    if (!customerRole) {
      customerRole = await prisma.role.create({
        data: { name: "customer", description: "Customer role for couples booking vendors" }
      });
    }

    const passwordHash = hashPassword(password);
    const verificationToken = crypto.randomUUID();

    // Step 2: Create user in PostgreSQL database via Prisma
    console.log(`${logPrefix} Step 2: Creating user record in PostgreSQL...`);
    const newUser = await prisma.user.create({
      data: {
        email: cleanEmail,
        passwordHash,
        fullName: cleanName,
        name: cleanName,
        phone: cleanPhone,
        isActive: true,
        isVerified: false,
        verificationToken,
        userRoles: {
          create: {
            roleId: customerRole.id
          }
        }
      }
    });

    console.log(`${logPrefix} Step 2 Success: User created in PostgreSQL (${newUser.id}).`);

    // Step 3: Dispatch Verification Email
    await sendVerificationMail({
      email: cleanEmail,
      name: cleanName,
      verificationToken,
      role: "customer",
    }).catch((err) => {
      console.error(`${logPrefix} Failed to send verification mail:`, err);
    });

    return NextResponse.json(
      {
        success: true,
        statusCode: 201,
        message: "Account created successfully! A confirmation email has been sent to your email inbox. Please click the link in the email to activate your account.",
        data: {
          user: {
            id: newUser.id,
            email: cleanEmail,
            fullName: cleanName,
            isVerified: false,
          },
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error(`${logPrefix} CRITICAL ERROR:`, err);
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
