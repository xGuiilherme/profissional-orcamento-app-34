import { User, Calculator, FileText } from 'lucide-react';

export const STEPS = [
  { number: 1, title: 'Dados do Cliente', icon: User },
  { number: 2, title: 'Serviço e Itens', icon: Calculator },
  { number: 3, title: 'Condições e Preview', icon: FileText }
];

export const PROFESSIONS = [
  { value: 'eletricista', label: 'Eletricista' },
  { value: 'encanador', label: 'Encanador' },
  { value: 'pintor', label: 'Pintor' },
  { value: 'pedreiro', label: 'Pedreiro' },
  { value: 'marceneiro', label: 'Marceneiro' },
  { value: 'outros', label: 'Outros (especificar)' }
];

export const UNITS = ['un', 'm²', 'm', 'kg', 'l', 'pç', 'h'];
