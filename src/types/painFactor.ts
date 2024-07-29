export type PainFactor = 'psychological distress' | 'sleep' | 'exercise' | 'nutrition' | 'social connection';

export interface PainFactorProps {
    factorType: PainFactor;
    factorValue: number;
}