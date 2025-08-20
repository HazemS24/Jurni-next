import { NextRequest, NextResponse } from 'next/server';
import { createInterest, emailExists, createInterestsTable } from '@/lib/models';
import { Interest } from '@/lib/models';

const VALID_HEARD_ABOUT_OPTIONS = [
  'search', 'instagram', 'tiktok', 'wordofmouth', 'referral', 
  'news', 'newsletter', 'sms', 'ads', 'other'
];

export async function POST(request: NextRequest) {
  try {
    // Ensure table exists
    const tableResult = await createInterestsTable();
    if (!tableResult.success) {
      return NextResponse.json(
        { 
          error: 'Database setup failed',
          details: 'Unable to initialize the database. Please try again later.'
        },
        { status: 500 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.email || !body.firstName || !body.lastName || !body.role || !body.heardAbout) {
      return NextResponse.json(
        { 
          error: 'Please fill in all required fields',
          details: 'First name, last name, email, role, and how you heard about us are required'
        },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { 
          error: 'Please enter a valid email address',
          details: 'The email format you entered is not valid'
        },
        { status: 400 }
      );
    }
    
    // Validate role
    if (!['investor', 'employer', 'applicant'].includes(body.role)) {
      return NextResponse.json(
        { 
          error: 'Please select a valid role',
          details: 'Role must be one of: investor, employer, or applicant'
        },
        { status: 400 }
      );
    }
    
    // Validate heardAbout - allow either predefined options or custom text
    let heardAboutValue = body.heardAbout;
    
    // If it's a predefined option, validate it
    if (VALID_HEARD_ABOUT_OPTIONS.includes(body.heardAbout)) {
      // This is a valid predefined option
      heardAboutValue = body.heardAbout;
    } else {
      // This might be custom text from "other" selection
      // Allow it as long as it's not empty and has reasonable length
      if (!body.heardAbout || body.heardAbout.trim().length < 3) {
        return NextResponse.json(
          { 
            error: 'Please provide more details about how you heard about us',
            details: 'If you selected "Other", please elaborate with at least 3 characters'
          },
          { status: 400 }
        );
      }
      // Use the custom text as the heardAbout value
      heardAboutValue = body.heardAbout;
    }
    
    // Check if email already exists
    const emailCheckResult = await emailExists(body.email);
    if (!emailCheckResult.success) {
      return NextResponse.json(
        { 
          error: 'Unable to verify email',
          details: 'Please try again later or contact support if the problem persists'
        },
        { status: 500 }
      );
    }
    
    if (emailCheckResult.data) {
      return NextResponse.json(
        { 
          error: 'This email is already registered',
          details: 'Please use a different email address or contact us if you need help'
        },
        { status: 409 }
      );
    }
    
    // Create interest record
    const interest: Interest = {
      email: body.email,
      first_name: body.firstName,
      last_name: body.lastName,
      role: body.role,
      heard_about: heardAboutValue,
      specific_interest: body.specificInterest || null,
    };
    
    const createResult = await createInterest(interest);
    if (!createResult.success) {
      return NextResponse.json(
        { 
          error: 'Unable to save your information',
          details: 'Please try again later or contact support if the problem persists'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        message: 'Successfully joined the waitlist!',
        id: createResult.data?.id 
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error processing interest submission:', error);
    return NextResponse.json(
      { 
        error: 'Unable to process your request',
        details: 'Please try again later or contact support if the problem persists'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Ensure table exists
    const tableResult = await createInterestsTable();
    if (!tableResult.success) {
      return NextResponse.json(
        { 
          error: 'Database setup failed',
          details: 'Unable to initialize the database. Please try again later.'
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { message: 'Interests API endpoint is working' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET request:', error);
    return NextResponse.json(
      { 
        error: 'Service temporarily unavailable',
        details: 'Please try again later'
      },
      { status: 503 }
    );
  }
}
