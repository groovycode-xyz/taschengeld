import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const soundsDirectory = path.join(process.cwd(), 'public', 'sounds', 'users');

  try {
    const fileNames = fs.readdirSync(soundsDirectory);
    const soundFiles = fileNames
      .filter((fileName) => fileName.endsWith('.mp3'))
      .map((fileName) => fileName.replace('.mp3', ''));

    res.status(200).json(soundFiles);
  } catch (error) {
    console.error('Error reading sounds directory:', error);
    res.status(500).json({ error: 'Unable to read sounds directory' });
  }
}
