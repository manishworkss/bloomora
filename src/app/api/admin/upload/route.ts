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

    const mimeType =
      sanitizedExt === '.png'
        ? 'image/png'
        : sanitizedExt === '.webp'
        ? 'image/webp'
        : sanitizedExt === '.gif'
        ? 'image/gif'
        : 'image/jpeg';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Upload to Supabase Storage bucket for permanent cloud hosting (across Vercel & local)
    if (supabaseUrl && serviceKey && !supabaseUrl.includes('placeholder')) {
      try {
        const uploadRes = await fetch(`${supabaseUrl}/storage/v1/object/bloomora-media/${filename}`, {
          method: 'POST',
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            'Content-Type': mimeType,
          },
          body: buffer,
        });

        if (uploadRes.ok) {
          const publicUrl = `${supabaseUrl}/storage/v1/object/public/bloomora-media/${filename}`;
          // Best effort local mirror
          try {
            const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
            await mkdir(uploadsDir, { recursive: true });
            await writeFile(path.join(uploadsDir, filename), buffer);
          } catch {}
          return NextResponse.json({ success: true, url: publicUrl });
        }
      } catch (uploadErr) {
        console.warn('Supabase Storage upload warning, falling back to local disk:', uploadErr);
      }
    }

    // Fallback to local public/uploads directory
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

