const { z } = require('zod');

const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required*'),
    email: z.string().min(1, 'Email is required*'),
    password: z.string().min(1, 'Password is required*'),
    tempOtp: z.string().optional(),
  }),
  file: z.object({
    path: z.string().min(1, 'File path is required*'),
  }),
});

module.exports = { createUserSchema };
