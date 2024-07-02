import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Initialize Prisma Client
const prisma = new PrismaClient()

// Define the expected request body structure
interface RequestBody {
  id: string
}

// Type guard function
function isValidRequestBody(body: unknown): body is RequestBody {
  return typeof body === 'object' && body !== null && 'id' in body && typeof (body as RequestBody).id === 'string';
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as unknown

    // Validate request body
    if (!isValidRequestBody(body)) {
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 })
    }

    const { id } = body

    if (!id) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 })
    }

    // Upsert the user (create if not exists, update if exists)
    const user = await prisma.user.upsert({
      where: { id: id },
      update: {},  // No update operation, but can be customized if needed
      create: { id: id },
    })

    // Send successful response
    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    // Log error for debugging purposes
    console.error('Error upserting user:', error)
    // Send error response
    return NextResponse.json({ message: 'Error upserting user' }, { status: 500 })
  } finally {
    // Disconnect Prisma Client to avoid connection leaks
    await prisma.$disconnect()
  }
}