import { User, Wrench, Calculator, FileText, Eye } from 'lucide-react';

export const STEPS = [
  { number: 1, title: 'Dados do Cliente', icon: User },
  { number: 2, title: 'Tipo de Serviço', icon: Wrench },
  { number: 3, title: 'Serviços e Materiais', icon: Calculator },
  { number: 4, title: 'Condições', icon: FileText },
  { number: 5, title: 'Preview', icon: Eye }
];

export const PROFESSIONS = [
  { value: 'eletricista', label: 'Eletricista' },
  { value: 'encanador', label: 'Encanador' },
  { value: 'pintor', label: 'Pintor' },
  { value: 'pedreiro', label: 'Pedreiro' },
  { value: 'marceneiro', label: 'Marceneiro' }
];

export const UNITS = ['un', 'm²', 'm', 'kg', 'l', 'pç', 'h'];
