export type PainFactor = 'psychological distress' | 'sleep' | 'exercise' | 'nutrition' | 'social connection';

export type PainFactorProps = {
    factorType: PainFactor;
    factorValue: number;
}