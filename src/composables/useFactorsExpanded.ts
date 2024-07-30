export const useFactorsExpanded = () => {
  const factorsExpanded = useState<Record<string, boolean>>('factorsExpanded', () => ({
    "psychological distress": false,
    'exercise': false,
    'nutrition': false,
    "social connection": false,
    'sleep': false,
  }))

  const toggleFactor = (factor: string) => {
    factorsExpanded.value = {
      ...factorsExpanded.value,
      [factor]: !factorsExpanded.value[factor]
    }
  }

  const disableAllFactors = () => {
    factorsExpanded.value = Object.keys(factorsExpanded.value).reduce((acc, factor) => {
      acc[factor] = false
      return acc
    }, {} as Record<string, boolean>)
  }

  const isFactorExpanded = (factor: string) => {
    return !!factorsExpanded.value[factor]
  }

  return {
    factorsExpanded,
    toggleFactor,
    disableAllFactors,
    isFactorExpanded
  }
}

export default useFactorsExpanded