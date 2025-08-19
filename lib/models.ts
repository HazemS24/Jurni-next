import pool from './database';

export interface Interest {
  id?: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'investor' | 'employer' | 'applicant';
  heard_about: string;
  specific_interest?: string;
  created_at?: Date;
}

export interface DatabaseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Create the interests table if it doesn't exist
export async function createInterestsTable(): Promise<DatabaseResult<void>> {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS interests (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('investor', 'employer', 'applicant')),
        heard_about TEXT NOT NULL,
        specific_interest TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Interests table created or already exists');
    return { success: true };
  } catch (error) {
    console.error('Error creating interests table:', error);
    return { 
      success: false, 
      error: 'Failed to create database table' 
    };
  } finally {
    client.release();
  }
}

// Insert a new interest
export async function createInterest(interest: Interest): Promise<DatabaseResult<Interest>> {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      INSERT INTO interests (email, first_name, last_name, role, heard_about, specific_interest)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [interest.email, interest.first_name, interest.last_name, interest.role, interest.heard_about, interest.specific_interest]);
    
    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error('Error creating interest:', error);
    return { 
      success: false, 
      error: 'Failed to create interest record' 
    };
  } finally {
    client.release();
  }
}

// Get all interests (for admin purposes)
export async function getAllInterests(): Promise<DatabaseResult<Interest[]>> {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT * FROM interests ORDER BY created_at DESC
    `);
    return { success: true, data: result.rows };
  } catch (error) {
    console.error('Error fetching interests:', error);
    return { 
      success: false, 
      error: 'Failed to fetch interests' 
    };
  } finally {
    client.release();
  }
}

// Check if email already exists
export async function emailExists(email: string): Promise<DatabaseResult<boolean>> {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT EXISTS(SELECT 1 FROM interests WHERE email = $1)
    `, [email]);
    return { success: true, data: result.rows[0].exists };
  } catch (error) {
    console.error('Error checking email:', error);
    return { 
      success: false, 
      error: 'Failed to check email existence' 
    };
  } finally {
    client.release();
  }
}
