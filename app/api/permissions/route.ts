import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const createPermissionSchema = z.object({
  name: z.string().min(1, "Permission name is required"),
  description: z.string().max(255).optional(),
});

/**
 * GET /api/permissions
 * Retrieves all permissions
 */
export async function GET(request: NextRequest) {
  try {
    const limited = rateLimit(request, {
      windowMs: 60_000,
      max: 60,
      keyPrefix: "permissions-get",
    });
    if (limited) return limited;

    // Check authentication
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all permissions
    const permissions = await prisma.permission.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        rolePermissions: {
          include: {
            role: true,
          },
        },
      },
    });

    return NextResponse.json(permissions);
  } catch (error) {
    console.error("Get permissions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/permissions
 * Creates a new permission
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createPermissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, description } = parsed.data;

    // Check if permission already exists
    const existing = await prisma.permission.findUnique({
      where: { name },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Permission with this name already exists" },
        { status: 409 }
      );
    }

    // Create permission
    const permission = await prisma.permission.create({
      data: {
        name,
        description: description || null,
      },
    });

    return NextResponse.json(permission, { status: 201 });
  } catch (error) {
    console.error("Create permission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
