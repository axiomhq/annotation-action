import * as core from '@actions/core'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const axiomUrl = core.getInput('axiomUrl') || 'https://api.axiom.co'

    const axiomToken = core.getInput('axiomToken', { required: true })
    core.setSecret(axiomToken) // Mask token in output

    const payload = {
      datasets: core
        .getInput('datasets', { required: true })
        .split(',')
        .map(d => d.trim()),
      time: core.getInput('time') || new Date().toISOString(),
      endTime: core.getInput('endTime') || undefined,
      title: core.getInput('title') || undefined,
      description: core.getInput('description') || undefined,
      url:
        core.getInput('url') ||
        `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`,
      type: core.getInput('type', { required: true })
    }

    core.debug(`Sending annotation to Axiom: ${JSON.stringify(payload)}`)
    const response = await fetch(`${axiomUrl}/v2/annotations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${axiomToken}`
      },
      body: JSON.stringify(payload)
    })
    if (!response.ok) {
      let traceIdMsg = ''
      const traceId = response.headers.get('x-axiom-trace-id')
      if (traceId) {
        traceIdMsg = ` (Trace ID: ${traceId})`
      }

      throw new Error(
        `Failed to send annotation to Axiom${traceIdMsg}: ${response.statusText}`
      )
    }

    core.debug('Decoding response')
    const annotation = await response.json()

    core.setOutput('id', annotation.id)
    core.info(`Created annotation ${annotation.id}`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
