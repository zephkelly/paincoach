export type PainFactor = 'psychological distress' | 'sleep' | 'exercise' | 'nutrition' | 'social connection';
export type PainFactorID = 'psychological' | 'sleep' | 'exercise' | 'nutrition' | 'social';

export interface PainFactorProps {
    factorID: PainFactorID
    factorType: PainFactor;
    factorValue: number;
}