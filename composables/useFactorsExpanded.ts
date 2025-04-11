export const useFactorsExpanded = () => {
    const factorsExpanded = ref(useState<Record<string, boolean>>('factorsExpanded', () => ({
        "psychological": false,
        'exercise': false,
        'nutrition': false,
        "social": false,
        'sleep': false,
    })));

    const toggleFactor = (factor: string) => {
        factorsExpanded.value = {
            ...factorsExpanded.value,
            [factor]: !factorsExpanded.value[factor]
        }
        return factorsExpanded.value[factor]
    }

    const disableAllFactors = () => {
        factorsExpanded.value = Object.keys(factorsExpanded.value).reduce((acc, factor) => {
            acc[factor] = false
            return acc
        }, {} as Record<string, boolean>)
    }

    const disableAllButThenToggle = (factor: string) => {
        const currentFactorState = factorsExpanded.value[factor]
        disableAllFactors()
        factorsExpanded.value = {
            ...factorsExpanded.value,
            [factor]: !currentFactorState
        }

        return factorsExpanded.value[factor]
    }

    const isAnyFactorExpanded = () => {
        return Object.values(factorsExpanded.value).some(value => value)
    }

    const isFactorExpanded = (factor: string) => {
        return !!factorsExpanded.value[factor]
    }

    return {
        factorsExpanded,
        toggleFactor,
        disableAllButThenToggle,
        disableAllFactors,
        isFactorExpanded,
        isAnyFactorExpanded
    }
}

export default useFactorsExpanded