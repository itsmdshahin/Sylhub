//src/server/validators/post.ts

import { z } from "zod";

export const createPostSchema = z.object({
  content: z.string().min(1).max(5000),
  imageUrl: z.string().url().nullable().optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).default("PUBLIC"),
});