import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Define the expected structure of the request body
interface RequestBody {
  userId?: string;
  text?: string;
  hash?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse the incoming request body
    const body: RequestBody = await request.json() as RequestBody;

    // Log the received data
    console.log('Received data:', body);

    // Simulate a main function call or processing the data
    const result = await mainFunction(body);

    // Log the result
    console.log('Processing result:', result);

    // Return the result as the API response
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error('Error in API route:', error);

    // Ensure the error is properly typed
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// Dummy main function to simulate processing the data
async function mainFunction(data: RequestBody) {
  // Simulate processing and return a result
  return {
    success: true,
    message: 'Data processed successfully',
    data,
  };
}
