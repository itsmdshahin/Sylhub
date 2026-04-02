//src/server/validators/engagement.ts

import { z } from "zod";

export const createPostSchema = z.object({
  content: z.string().trim().min(1).max(5000),
  imageUrl: z.string().url().nullable().optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).default("PUBLIC"),
});

export const updatePostSchema = z
  .object({
    content: z.string().trim().min(1).max(5000).optional(),
    imageUrl: z.string().url().nullable().optional(),
    visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const commentSchema = z.object({
  postId: z.string().uuid(),
  content: z.string().trim().min(1).max(2000),
});

export const updateCommentSchema = z.object({
  content: z.string().trim().min(1).max(2000),
});

export const replySchema = z.object({
  commentId: z.string().uuid(),
  content: z.string().trim().min(1).max(2000),
});

export const updateReplySchema = z.object({
  content: z.string().trim().min(1).max(2000),
});

export const likeSchema = z
  .object({
    postId: z.string().uuid().optional(),
    commentId: z.string().uuid().optional(),
    replyId: z.string().uuid().optional(),
  })
  .refine(
    (data) =>
      [data.postId, data.commentId, data.replyId].filter(Boolean).length === 1,
    { message: "Exactly one target is required" }
  );