import * as core from '@actions/core'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const datasets = core
      .getInput('axiom_datasets', { required: true })
      .split(',')
    const token = core.getInput('axiom_token', { required: true })
    const title = core.getInput('title', { required: true })
    const description = core.getInput('description', { required: true })
    const url =
      core.getInput('url', { required: false }) ??
      `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug('Sending annotation to Axiom')

    const body = {
      type: 'deploy',
      time: new Date().toISOString(),

      datasets,
      title,
      description,
      url
    }

    // Log the annotation details
    core.debug(
      `Annotation: ${JSON.stringify({
        datasets,
        title,
        description,
        url
      })}`
    )

    // Send the annotation to Axiom
    const response = await fetch('https://api.axiom.co/v2/annotations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    })

    // Throw an error if the request fails
    if (!response.ok) {
      throw new Error(
        `Failed to send annotation to Axiom: ${response.statusText}`
      )
    }

    core.debug('Annotation sent to Axiom')
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
