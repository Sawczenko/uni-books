import { NextApiRequest, NextApiResponse } from 'next'; // Or use Express types

import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// Assuming you are using Next.js API routes
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (req.url === '/api/auth/signup') {
      // Sign Up
      try {
        const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (existingUser.length > 0) {
          return res.status(409).json({ message: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.insert(users).values({
          email: email,
          password: hashedPassword,
        });

        return res.status(201).json({ message: 'User created successfully' });
      } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ message: 'Something went wrong during signup' });
      }
    } else if (req.url === '/api/auth/login') {
      // Login
      try {
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (!user) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }

        // In a real application, you would generate and return a JWT or session token here
        return res.status(200).json({ message: 'Login successful', user: { id: user.id, email: user.email } });
      } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Something went wrong during login' });
      }
    } else {
      return res.status(404).json({ message: 'Not Found' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}