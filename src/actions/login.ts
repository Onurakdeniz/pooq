
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function upsertUser(userId: string): Promise<void> {
  await prisma.user.upsert({
    where: { id: userId },
    update: {

    },
    create: {
      id: userId,
      createdAt: new Date(),
    },
  })

  console.log(`Upserting user with ID: ${userId}`)
}

export async function loginUser(userId: string) {
  try {
    await upsertUser(userId)
    
    // Set a cookie to indicate the user is logged in
 
  } catch (error) {
    console.error('Failed to upsert user:', error)
    throw new Error('Login failed')
  }

  // Perform the redirect outside of the try/catch block
  redirect('/feed')
}