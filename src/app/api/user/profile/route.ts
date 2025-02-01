import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import {authOptions} from "@/app/api/auth/auth.config";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { name, email, image, address, city, zipCode } = body;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          NOT: {
            id: session.user.id,
          },
        },
      });

      if (existingUser) {
        return new NextResponse('Email already taken', { status: 400 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: name ?? undefined,
        email: email ?? undefined,
        image: image === null ? null : image ?? undefined,
        address: address ?? undefined,
        city: city ?? undefined,
        zipCode: zipCode ?? undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        address: true,
        city: true,
        zipCode: true,
      },
    });

    // Return the updated user data to update the session
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('PROFILE_ERROR', error);
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 });
    }
    return new NextResponse('Something went wrong', { status: 500 });
  }
}