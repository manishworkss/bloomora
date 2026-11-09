import { NextResponse, type NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image file uploaded' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate size (max 8MB)
    if (buffer.length > 8 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Image file size must be under 8MB' },
        { status: 400 }
      );
    }

    // Determine extension
    const originalName = file.name || 'image.jpg';
    const ext = path.extname(originalName) || '.jpg';
    const sanitizedExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext.toLowerCase())
      ? ext.toLowerCase()
      : '.jpg';

    const filename = `bloomora-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${sanitizedExt}`;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err: any) {
    console.error('Image upload failed:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Image upload failed' },
      { status: 500 }
    );
  }
}
