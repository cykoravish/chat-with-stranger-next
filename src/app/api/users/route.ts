import { NextRequest, NextResponse } from 'next/server';
import { User } from './model'; // Adjust the import path as needed
import connectDatabase from './db'; // Adjust the import path as needed

// Handles POST requests to create a new user
export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectDatabase();

    // Parse the request body
    const body = await request.json();

    // Validate the input
    const { name } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Name is required and must be a string' 
        }, 
        { status: 400 }
      );
    }

    // Create new user
    const newUser = new User({
      name,
      timestamp: new Date()
    });

    // Save user to database
    await newUser.save();

    // Return success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'User created successfully',
        user: {
          name: newUser.name,
          timestamp: newUser.timestamp
        }
      }, 
      { status: 201 }
    );

  } catch (error) {
    console.error('User creation error:', error);

    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      }, 
      { status: 500 }
    );
  }
}

// Optional: Handle GET requests to retrieve users
export async function GET() {
  try {
    // Connect to the database
    await connectDatabase();

    // Retrieve users (limited to prevent overwhelming response)
    const users = await User.find().sort({ timestamp: -1 }).limit(100);

    return NextResponse.json(
      { 
        success: true, 
        users 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving users:', error);

    return NextResponse.json(
      { 
        success: false, 
        message: 'Error retrieving users' 
      }, 
      { status: 500 }
    );
  }
}