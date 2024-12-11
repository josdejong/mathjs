const durationWidth = 10
const varianceWidth = 8

/**
 * Format a result like "Task name   2.30 µs ±0.79%"
 * @param {import('tinybench').Bench} bench
 * @param {import('tinybench').Task} task
 * @return {string}
 */
export function formatTaskResult (bench, task) {
  const nameWidth = Math.max(...bench.tasks.map(task => task.name.length)) + 1

  const name = task.name
  const { variance, mean } = task.result.latency

  const meanStr = `${(mean * 1000).toFixed(2)} \u00b5s`
  const varianceStr = `±${((variance / mean) * 100).toFixed(2)}%`
  return `${padRight(name, nameWidth)} ${padLeft(meanStr, durationWidth)} ${padLeft(varianceStr, varianceWidth)}`
}

function padRight (text, len, char = ' ') {
  const add = Math.max(len - text.length, 0)

  return text + char.repeat(add)
}

function padLeft (text, len, char = ' ') {
  const add = Math.max(len - text.length, 0)

  return char.repeat(add) + text
}
