// 1. DEFINIÇÕES DE TIPO (TIPAGEM)
export interface FormItem {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  type: 'material' | 'labor';
}

export interface FormDataState {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  observations: string;
  profession: string;
  template: string;
  items: FormItem[];
  deadline: string;
  payment: string;
  warranty: string;
  generalObservations: string;
  validity: string;
  subtotalMaterials: number;
  subtotalLabor: number;
  discount: number;
  total: number;
}

// 2. AÇÕES POSSÍVEIS
export type FormAction =
  | { type: 'UPDATE_FIELD'; field: keyof Omit<FormDataState, 'items'>; payload: string | number }
  | { type: 'SET_FROM_TEMPLATE'; payload: Partial<FormDataState> }
  | { type: 'ADD_ITEM' }
  | { type: 'REMOVE_ITEM'; payload: { index: number } }
  | { type: 'UPDATE_ITEM'; payload: { index: number; field: keyof FormItem; value: string | number } };


// 3. ESTADO INICIAL
export const initialState: FormDataState = {
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  clientAddress: '',
  observations: '',
  profession: '',
  template: '',
  items: [{ description: '', quantity: 1, unit: 'un', unitPrice: 0, total: 0, type: 'material' }],
  deadline: '',
  payment: '',
  warranty: '',
  generalObservations: '',
  validity: '30',
  subtotalMaterials: 0,
  subtotalLabor: 0,
  discount: 0,
  total: 0,
};

// 4. FUNÇÃO AUXILIAR DE CÁLCULO
const calculateTotals = (items: FormItem[], discount: number) => {
    const subtotalMaterials = items
      .filter(item => item.type === 'material')
      .reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

    const subtotalLabor = items
      .filter(item => item.type === 'labor')
      .reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

    const subtotal = subtotalMaterials + subtotalLabor;
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal - discountAmount;

    return { subtotalMaterials, subtotalLabor, total };
}

// 5. A FUNÇÃO REDUCER PRINCIPAL
export const orcamentoFormReducer = (state: FormDataState, action: FormAction): FormDataState => {
  switch (action.type) {
    case 'UPDATE_FIELD': {
      const newState = { ...state, [action.field]: action.payload };
      if (action.field === 'discount') {
          const totals = calculateTotals(newState.items, Number(newState.discount));
          return { ...newState, ...totals };
      }
      return newState;
    }

    case 'SET_FROM_TEMPLATE':
      // Garante que o payload de 'items' seja tratado corretamente se for undefined
      return { ...state, ...action.payload, ...calculateTotals(action.payload.items || [], state.discount) };

    case 'ADD_ITEM': {
      const newItem: FormItem = {
        description: '',
        quantity: 1,
        unit: 'un',
        unitPrice: 0,
        total: 0,
        type: 'material'
      };
      const newItems = [...state.items, newItem];
      return { ...state, items: newItems };
    }
      
    case 'REMOVE_ITEM': {
        const newItems = state.items.filter((_, i) => i !== action.payload.index);
        const totals = calculateTotals(newItems, state.discount);
        return { ...state, items: newItems, ...totals };
    }

    case 'UPDATE_ITEM': {
      const newItems = [...state.items];
      const { index, field, value } = action.payload;
      
      // Criamos uma cópia do item para modificar
      const updatedItem = { ...newItems[index], [field]: value };
      if (field === 'quantity' || field === 'unitPrice') {
        updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
      }
      newItems[index] = updatedItem;
      
      const totals = calculateTotals(newItems, state.discount);
      return { ...state, items: newItems, ...totals };
    }

    default:
      return state;
  }
};