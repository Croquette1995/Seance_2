export type TabId = 
  | 'sentinel-vs-exceptions'
  | 'stack-unwinding'
  | 'try-catch-finally'
  | 'error-object-strict-typing'
  | 'custom-domain-errors'
  | 'filtering-polymorphism'
  | 'architectural-strategies'
  | 'atm-simulator'
  | 'workshops-lab';

export interface ModuleSection {
  id: TabId;
  index: number;
  title: string;
  shortTitle: string;
  icon: string;
  badge?: string;
  description: string;
  labNumber?: number;
  exerciseCount?: number;
}

// Modèles d'évaluation et console virtuelle
export interface ConsoleLogEntry {
  type: 'log' | 'info' | 'warn' | 'error' | 'success';
  timestamp: string;
  message: string;
}

export interface ValidationCriterion {
  id: string;
  label: string;
  description: string;
  passed: boolean;
  hint: string;
}

export interface SyntaxRequirement {
  type: 'keyword' | 'regex' | 'forbidden';
  pattern: RegExp | string;
  label: string;
  errorMessage: string;
}

export interface ExerciseDef {
  id: string;
  labNumber: number;
  number: string;
  title: string;
  subtitle: string;
  sectionId: TabId;
  estimatedTime: string;
  difficulty: 'Débutant' | 'Facile' | 'Intermédiaire';
  statement: string;
  hint: string;
  initialCode: string;
  solutionCode: string;
  solutionExplanation: string[];
  syntaxRequirements: SyntaxRequirement[];
  evaluateFn: (sandbox: any, logs: string[]) => { criterionId: string; passed: boolean; message?: string }[];
  criteria: ValidationCriterion[];
  isCompleted: boolean;
}

export interface Exercise extends ExerciseDef {
  currentCode: string;
}

export interface ValidationSummary {
  success: boolean;
  passedCount: number;
  totalCount: number;
  messages: string[];
  consoleLogs: ConsoleLogEntry[];
  executionError?: string;
}
