function levenshteinDistance(a: string, b: string): number {
  const matrix = Array.from(
    { length: a.length + 1 },
    () => Array(b.length + 1).fill(0) as number[],
  )

  for (let i = 0; i <= a.length; i++) {
    matrix[i]![0] = i
  }

  for (let j = 0; j <= b.length; j++) {
    matrix[0]![j] = j
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      matrix[i]![j] = Math.min(
        matrix[i - 1]![j]! + 1, // Deletion
        matrix[i]![j - 1]! + 1, // Insertion
        matrix[i - 1]![j - 1]! + cost, // Substitution
      )
    }
  }

  return matrix[a.length]![b.length]!
}

export default function spellCheck(partialWord: string, dictionary: string[]) {
  return dictionary
    .map((word) => {
      const distance = levenshteinDistance(
        partialWord.toLowerCase(),
        word.toLowerCase().slice(0, partialWord.length),
      )
      return { word, distance }
    })
    .filter((item) => item.distance < 3)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5)
    .map((item) => item.word)
}
