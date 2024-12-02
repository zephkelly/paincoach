export interface DBEntry {
    entry_id: string;
    pain: number;
    p_mood: number;
    p_stress: number;
    p_anxiety: number;
    s_quality: number;
    s_duration: number;
    s_wakeup: number;
    d_variety: number;
    d_packaged: number;
    d_meat_dairy: number;
    e_intensity: number;
    e_duration: number;
    e_exertion: number;
    s_work_relations: number;
    s_family_relations: number;
    s_social_relations: number;
}

type EntryData = Omit<DBEntry, 'entry_id'>;

interface CorrelationResult {
    correlation: number;
    pValue: number;
}

export class PainDataAnalyser {
    // Calculate Pearson correlation coefficient
    private calculateCorrelation(x: number[], y: number[]): number {
        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumXSquare = x.reduce((sum, xi) => sum + xi * xi, 0);
        const sumYSquare = y.reduce((sum, yi) => sum + yi * yi, 0);
    
        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt(
            (n * sumXSquare - sumX * sumX) * (n * sumYSquare - sumY * sumY)
        );
    
        return denominator === 0 ? 0 : numerator / denominator;
    }
  
    // Calculate p-value using t-distribution approximation
    private calculatePValue(correlation: number, n: number): number {
        const t = correlation * Math.sqrt((n - 2) / (1 - correlation * correlation));
        // This is a simplified p-value calculation
        // For more accuracy, you might want to use a proper t-distribution library
        return 2 * (1 - this.normalCDF(Math.abs(t)));
    }
  
    // Helper function for normal cumulative distribution
    private normalCDF(x: number): number {
        const t = 1 / (1 + 0.2316419 * Math.abs(x));
        const d = 0.3989423 * Math.exp((-x * x) / 2);
        const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        return x > 0 ? 1 - probability : probability;
    }
  
    // Simple linear regression
    private linearRegression(x: number[], y: number[]): { slope: number; intercept: number; rSquared: number } {
        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumXSquare = x.reduce((sum, xi) => sum + xi * xi, 0);
    
        const slope = (n * sumXY - sumX * sumY) / (n * sumXSquare - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
    
        // Calculate R-squared
        const yMean = sumY / n;
        const totalSS = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
        const residualSS = y.reduce((sum, yi, i) => {
            const prediction = slope * x[i] + intercept;
            return sum + Math.pow(yi - prediction, 2);
        }, 0);
        const rSquared = 1 - residualSS / totalSS;
    
        return { slope, intercept, rSquared };
    }
  
    // Main analysis method
    public analyzeHealthData(data: EntryData[]): {
        correlations: { [key: string]: CorrelationResult };
        regression: { [key: string]: { slope: number; intercept: number; rSquared: number } };
    } {
        const painValues = data.map(d => d.pain);
        const correlations: { [key: string]: CorrelationResult } = {};
        const regression: { [key: string]: { slope: number; intercept: number; rSquared: number } } = {};
    
        // Analyze each variable's relationship with pain
        Object.keys(data[0]).forEach(key => {
            if (key !== 'pain') {
            const values = data.map(d => d[key as keyof EntryData]);
            const correlation = this.calculateCorrelation(values, painValues);
            const pValue = this.calculatePValue(correlation, data.length);
            correlations[key] = { correlation, pValue };
            
            // Perform linear regression
            regression[key] = this.linearRegression(values, painValues);
            }
        });
    
        return { correlations, regression };
    }
  
    private addNoise(baseValue: number, noiseRange: number, min: number, max: number): number {
        // Combine multiple random sources for more natural distribution
        const noise = (
            (Math.random() * 0.5) +  // Uniform component
            (Math.random() * Math.random() * 0.3) +  // Right-skewed component
            ((Math.random() - 0.5) * 0.2)  // Symmetric component
        ) * noiseRange;
        
        return Math.round(Math.max(min, Math.min(max, baseValue + noise)));
    }

    // Modified sigmoid for less deterministic relationships
    private sigmoid(x: number, steepness: number = 1, midpoint: number = 0): number {
        const randomVariation = (Math.random() - 0.5) * 0.15;  // Add subtle random variation
        return 1 / (1 + Math.exp(-steepness * (x - midpoint))) + randomVariation;
    }

    // New function to add naturalistic daily fluctuations
    private addDailyVariation(baseValue: number, amplitude: number): number {
        return baseValue + (Math.sin(Math.random() * Math.PI * 2) * amplitude);
    }

    public generateSyntheticData(n: number): EntryData[] {
        const data: EntryData[] = [];
        
        for (let i = 0; i < n; i++) {
            // Generate base psychological factors with more natural variation
            const baseStress = this.addDailyVariation(
                Math.random() * 4 + 2,  // Base range (2-6)
                0.5  // Daily variation amplitude
            );

            // Add more independence between stress and anxiety
            const baseAnxiety = (
                this.sigmoid(baseStress - 4, 0.6) * 1.5 + // Reduced stress influence
                Math.random() * 2.5 + 2 +  // Increased random component
                this.addDailyVariation(0, 0.3)  // Daily fluctuations
            );

            // More independent social support calculation
            const baseSocialSupport = Math.max(3, Math.min(7, 
                Math.random() * 3 + 4 + // Base component (4-7)
                -this.sigmoid(baseStress - 4, 0.3) * 0.6 - // Reduced stress influence
                this.sigmoid(baseAnxiety - 3.5, 0.3) * 0.6 + // Reduced anxiety influence
                this.addDailyVariation(0, 0.3)  // Daily variation
            ));

            // Less deterministic mood calculation
            const baseMood = (
                9 - 
                this.sigmoid(baseStress - 3, 0.5) * 2.5 -  // Reduced stress impact
                this.sigmoid(baseAnxiety - 2.5, 0.5) * 1.8 + // Reduced anxiety impact
                this.sigmoid(baseSocialSupport - 4, 0.5) * 1.5 + // Reduced support impact
                Math.random() * 2 - 1  // Increased random component
            );

            const baseSocialRelations = Math.max(5, Math.min(7,
                5.5 + // Start from middle of valid range (5-7)
                this.sigmoid(baseMood - 5, 0.4) * 0.8 + // Mood influence
                -this.sigmoid(baseAnxiety - 3.5, 0.4) * 0.6 + // Anxiety impact
                this.sigmoid(baseSocialSupport - 4, 0.5) * 0.7 + // Social support benefit
                (Math.random() * 0.8 - 0.4) // Controlled random variation
            ));


            // More variable sleep quality calculation
            const stressAnxietyInteraction = (baseStress * baseAnxiety / 10) * (0.8 + Math.random() * 0.4);
            const baseSleepQuality = (
                8 - 
                this.sigmoid(stressAnxietyInteraction - 2, 0.6) * 1.8 +  // Reduced impact
                this.sigmoid(baseSocialSupport - 4, 0.4) * 0.8 + // Reduced impact
                this.addDailyVariation(0, 0.6)  // Daily variation
            );
            
            const baseSleepDuration = (
                baseSleepQuality - 
                this.sigmoid(baseStress - 4, 0.5) * 0.8 - 
                Math.random() * 2
            );

            // More variable wakeups
            const baseWakeups = Math.min(2, (
                this.sigmoid(stressAnxietyInteraction - 1.5, 0.8) * 1.2 +
                (1 - this.sigmoid(baseSleepQuality - 6, 0.6)) * 0.4 +
                Math.random() * 0.4  // Added randomness
            ));

            // Less deterministic exercise patterns
            const baseExerciseIntensity = (
                this.sigmoid(baseMood - 5, 0.5) * 1.5 +
                this.sigmoid(baseSocialSupport - 4, 0.3) * 0.8 + 
                1.5 +
                this.addDailyVariation(0, 0.3)
            );
            
            const baseExerciseDuration = (
                baseExerciseIntensity * 3.5 +
                this.sigmoid(baseSocialSupport - 4, 0.4) * 4 +
                10 +
                Math.random() * 5 - 2.5  // Wider random variation
            );

            // More variable diet patterns
            const baseDietVariety = (
                this.sigmoid(baseMood - 5, 0.6) * 1.2 +
                this.sigmoid(baseSocialSupport - 4, 0.4) * 1.2 +
                3.5 +
                this.addDailyVariation(0, 0.3)
            );

            // More complex and variable pain calculation
            const painContributions = [
                (1 - this.sigmoid(baseSleepQuality - 6, 0.7)) * 1.8,
                this.sigmoid(baseStress - 3, 0.5) * 1.3,
                this.sigmoid(baseAnxiety - 3, 0.5) * 1.3,
                (1 - this.sigmoid(baseExerciseIntensity - 2.5, 0.6)) * 1,
                (1 - this.sigmoid(baseDietVariety - 4.5, 0.6)) * 1,
                (1 - this.sigmoid(baseSocialSupport - 4, 0.4)) * 0.8
            ].map(value => value * (0.8 + Math.random() * 0.4));  // Add variation to each contributor

            const basePain = painContributions.reduce((sum, curr) => sum + curr, 0);

            // Generate entry with increased noise ranges
            data.push({
                pain: this.addNoise(basePain, 1.4, 0, 5),

                // Psychological metrics with more variation
                p_mood: this.addNoise(baseMood, 1.4, 3, 10),
                p_stress: this.addNoise(baseStress, 1.0, 2, 6),
                p_anxiety: this.addNoise(baseAnxiety, 1.0, 2, 5),

                // Sleep metrics with more variation
                s_quality: this.addNoise(baseSleepQuality, 1.4, 5, 8),
                s_duration: this.addNoise(baseSleepDuration, 1.4, 5, 8),
                s_wakeup: this.addNoise(baseWakeups, 0.8, 0, 2),

                // Diet metrics with more independence
                d_variety: this.addNoise(baseDietVariety, 1.0, 4, 6),
                d_packaged: this.addNoise(7 - baseDietVariety + Math.random() - 0.5, 1.0, 1, 3),
                d_meat_dairy: this.addNoise(4 - baseDietVariety/2 + Math.random() - 0.5, 1.0, 1, 3),

                // Exercise metrics with more variation
                e_intensity: this.addNoise(baseExerciseIntensity, 1.0, 2, 4),
                e_duration: this.addNoise(baseExerciseDuration, 4.0, 15, 30),
                e_exertion: this.addNoise(baseExerciseIntensity * 0.75, 1.0, 2, 3),

                // Social metrics with more independence
                s_work_relations: this.addNoise(
                    Math.max(3, Math.min(5,
                        4 + // Base level
                        this.sigmoid(baseMood - 5, 0.4) * 0.8 +
                        -this.sigmoid(baseStress - 4, 0.4) * 0.6 +
                        this.sigmoid(baseSocialSupport - 4, 0.4) * 0.5 +
                        (Math.random() * 0.6 - 0.3)
                    )),
                    0.8, 3, 5
                ),
                s_family_relations: this.addNoise(
                    Math.max(3, Math.min(5,
                        4 + // Base level
                        this.sigmoid(baseMood - 5, 0.4) * 0.8 +
                        -this.sigmoid(baseStress - 4, 0.4) * 0.5 +
                        this.sigmoid(baseSocialSupport - 4, 0.5) * 0.6 +
                        (Math.random() * 0.6 - 0.3)
                    )),
                    0.8, 3, 5
                ),
                s_social_relations: this.addNoise(
                    baseSocialRelations,
                    0.8, 5, 7
                )
            });
        }

        return data;
    }
}