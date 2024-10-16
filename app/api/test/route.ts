import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Test API route accessed');
  return NextResponse.json({ message: 'Test API is working' });
}
