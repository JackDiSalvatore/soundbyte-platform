// import { z } from "zod";
// import { User } from "./auth.types";

// export const Session = z.object({
//   expiresAt: z.coerce.date(),
//   token: z.string().nullish(),
//   createdAt: z.coerce.date(),
//   updatedAt: z.coerce.date(),
//   ipAddress: z.string().nullish().optional(),
//   userAgent: z.string().nullish().optional(),
//   userId: z.string().nullish(),
//   id: z.string().nullish().optional(),
// });
// export type Session = z.infer<typeof Session>;

// export const AuthSession = z
//   .object({
//     session: Session,
//     user: User,
//   })
//   .nullable();
// export type AuthSession = z.infer<typeof AuthSession>;
