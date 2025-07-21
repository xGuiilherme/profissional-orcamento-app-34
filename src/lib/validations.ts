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

// VALIDAÇÃO DE EMAIL OPCIONAL (para formulários onde email não é obrigatório)
export const optionalEmailSchema = z.string().optional().refine(
  (email) => {
    if (!email || email.trim() === '') return true; // Email vazio é válido (opcional)
    return z.string().email().safeParse(email).success; // Se preenchido, deve ser válido
  },
  {
    message: "Por favor, insira um endereço de e-mail válido."
  }
);

// FUNÇÃO UTILITÁRIA PARA VALIDAR EMAIL
export const isValidEmail = (email: string): boolean => {
  if (!email || email.trim() === '') return true; // Email vazio é válido quando opcional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// FUNÇÃO UTILITÁRIA PARA VALIDAR TELEFONE BRASILEIRO
export const isValidPhone = (phone: string): boolean => {
  if (!phone || phone.trim() === '') return false; // Telefone é obrigatório

  // Remove todos os caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '');

  // Deve ter 11 dígitos (DDD + 9 dígitos)
  if (cleanPhone.length !== 11) return false;

  // Verifica se o DDD é válido (11-99, exceto alguns inválidos)
  const ddd = parseInt(cleanPhone.substring(0, 2));
  const validDDDs = [
    11, 12, 13, 14, 15, 16, 17, 18, 19, // SP
    21, 22, 24, // RJ/ES
    27, 28, // ES
    31, 32, 33, 34, 35, 37, 38, // MG
    41, 42, 43, 44, 45, 46, // PR
    47, 48, 49, // SC
    51, 53, 54, 55, // RS
    61, // DF/GO
    62, 64, // GO
    63, // TO
    65, 66, // MT
    67, // MS
    68, // AC
    69, // RO
    71, 73, 74, 75, 77, // BA
    79, // SE
    81, 87, // PE
    82, // AL
    83, // PB
    84, // RN
    85, 88, // CE
    86, 89, // PI
    91, 93, 94, // PA
    92, 97, // AM
    95, // RR
    96, // AP
    98, 99 // MA
  ];

  if (!validDDDs.includes(ddd)) return false;

  // Verifica se o primeiro dígito do número é 9 (celular)
  const firstDigit = parseInt(cleanPhone.substring(2, 3));
  if (firstDigit !== 9) return false;

  // Verifica se não são todos os dígitos iguais
  const allSameDigit = cleanPhone.split('').every(digit => digit === cleanPhone[0]);
  if (allSameDigit) return false;

  return true;
};

// ESQUEMA DE VALIDAÇÃO PARA ORÇAMENTO
export const budgetFormSchema = z.object({
  clientName: z.string().min(1, { message: "Nome do cliente é obrigatório." }),
  clientPhone: z.string().refine(isValidPhone, {
    message: "Telefone inválido. Use o formato (11) 99999-9999 com DDD válido."
  }),
  clientEmail: z.string().optional().refine(
    (email) => {
      if (!email || email.trim() === '') return true;
      return z.string().email().safeParse(email).success;
    },
    { message: "Email inválido. Use o formato exemplo@email.com" }
  ),
  clientAddress: z.string().min(1, { message: "Endereço é obrigatório." }),
});