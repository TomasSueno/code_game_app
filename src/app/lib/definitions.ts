import * as z from "zod"

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Meno musí mať aspoň 2 znaky." })
    .trim(),
  email: z
    .email({ error: "Zadajte platnú e-mailovú adresu." })
    .trim(),
  password: z
    .string()
    .min(8, { error: "Mať aspoň 8 znakov." })
    .regex(/[a-zA-Z]/, { error: "Obsahovať aspoň jedno písmeno." })
    .regex(/[0-9]/, { error: "Obsahovať aspoň jedno číslo." })
    .regex(/[^a-zA-Z0-9]/, {
      error: "Obsahovať aspoň jeden špeciálny znak.",
    })
    .trim(),
})

 
export type FormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined