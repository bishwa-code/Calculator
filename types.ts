export type Operator = 
  | '+' 
  | '-' 
  | '*' 
  | '/' 
  | '^2' 
  | '^3' 
  | 'sqrt' 
  | 'cbrt';

export interface CalculationHistory {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export enum ButtonVariant {
  DEFAULT = 'default',
  ACTION = 'action',
  ACCENT = 'accent',
  DANGER = 'danger',
  GHOST = 'ghost'
}
