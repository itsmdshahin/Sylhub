//src/app/api/uploads/image/route.ts
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import path from "path";
import { supabaseAdmin } from "@/src/server/db/supabase-admin";
import { getCurrentUser } from "@/src/server/auth/current-user";

export const runtime = "nodejs";

async function ensureBucketExists(bucket: string) {
  const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();

  if (listError) {
    throw new Error(listError.message);
  }

  const existing = (buckets ?? []).find((b) => b.name === bucket);

  if (!existing) {
    const { error: createError } = await supabaseAdmin.storage.createBucket(bucket, {
      public: true,
    });

    if (createError) {
      throw new Error(createError.message);
    }

    return;
  }

  if (!existing.public) {
    const { error: updateError } = await supabaseAdmin.storage.updateBucket(bucket, {
      public: true,
    });

    if (updateError) {
      throw new Error(updateError.message);
    }
  }
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bucket = process.env.SUPABASE_STORAGE_BUCKET;
  if (!bucket) {
    return NextResponse.json(
      { error: "SUPABASE_STORAGE_BUCKET is not set" },
      { status: 500 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Image must be 10MB or less" },
      { status: 400 }
    );
  }

  const ext = path.extname(file.name) || ".jpg";
  const filePath = `${user.id}/${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await ensureBucketExists(bucket);

    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message || "Upload failed" },
        { status: 500 }
      );
    }

    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);

    return NextResponse.json({
      url: data.publicUrl,
      path: filePath,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Upload failed" },
      { status: 500 }
    );
  }
}