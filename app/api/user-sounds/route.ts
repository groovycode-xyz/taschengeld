import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const soundsDir = path.join(process.cwd(), 'public', 'sounds', 'users');
    const files = fs.readdirSync(soundsDir);

    const sounds = files.map((file) => {
      const name = path.parse(file).name;
      const extension = path.parse(file).ext;
      return { name, extension };
    });

    return NextResponse.json(sounds);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sounds' }, { status: 500 });
  }
}
