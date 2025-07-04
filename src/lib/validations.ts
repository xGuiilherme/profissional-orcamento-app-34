import { z } from 'zod';

// ESQUEMA DE VALIDAÇÃO PARA O CADASTRO
export const signupSchema = z.object({
  fullName: z.string().min(1, { message: "O nome não pode estar vazio." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  profession: z.string().min(1, { message: "Por favor, selecione uma profissão." }),
  phone: z.string().min(1, { message: "O WhatsApp não pode estar vazio." }),
  password: z.string()
    .min(9, { message: "A senha deve ter pelo menos 9 caracteres." })
    .regex(/[A-Z]/, { message: "A senha deve conter pelo menos uma letra maiúscula." })
    .regex(/[a-z]/, { message: "A senha deve conter pelo menos uma letra minúscula." })
    .regex(/[0-9]/, { message: "A senha deve conter pelo menos um dígito." })
    .regex(/[@#\\$]/, { message: "A senha deve conter um caractere especial (@, #, $)." }),
  confirmPassword: z.string(),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "Você deve aceitar os termos de uso." }),
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});

export type SignupFormData = z.infer<typeof signupSchema>;