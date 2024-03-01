/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Mock the GitHub Actions core library
let debugMock: jest.SpyInstance
let errorMock: jest.SpyInstance
let getInputMock: jest.SpyInstance
let setFailedMock: jest.SpyInstance

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    debugMock = jest.spyOn(core, 'debug').mockImplementation()
    errorMock = jest.spyOn(core, 'error').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
  })

  it('sends an annotation', async () => {
    global.fetch = jest.fn(async () =>
      Promise.resolve({
        ok: true
      })
    ) as unknown as typeof fetch

    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'axiom_datasets':
          return 'test-dataset'
        case 'axiom_token':
          return 'test'
        case 'title':
          return 'test title'
        case 'description':
          return 'This is a test'
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(debugMock).toHaveBeenNthCalledWith(1, 'Sending annotation to Axiom')
    expect(debugMock).toHaveBeenNthCalledWith(
      2,
      `Annotation: ${JSON.stringify({
        datasets: ['test-dataset'],
        title: 'test title',
        description: 'This is a test',
        url: `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      })}`
    )
    expect(setFailedMock).not.toHaveBeenCalled()
    expect(debugMock).toHaveBeenNthCalledWith(3, 'Annotation sent to Axiom')
    expect(errorMock).not.toHaveBeenCalled()
  })

  it('exits with failure if annotation failed to create', async () => {
    global.fetch = jest.fn(async () =>
      Promise.resolve({
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      })
    ) as unknown as typeof fetch

    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'axiom_datasets':
          return 'test-dataset'
        case 'axiom_token':
          return 'test'
        case 'title':
          return 'test title'
        case 'description':
          return 'This is a test'
        case 'url':
          return 'https://example.com'
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(debugMock).toHaveBeenNthCalledWith(1, 'Sending annotation to Axiom')
    expect(setFailedMock).toHaveBeenCalledWith(
      'Failed to send annotation to Axiom: Unauthorized'
    )
  })

  it('sets a failed status on error', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(
      (name: string, options: { required: boolean }) => {
        if (options && options.required) {
          throw new Error(`Input required and not supplied: ${name}`)
        }
      }
    )

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      'Input required and not supplied: axiom_datasets'
    )
    expect(errorMock).not.toHaveBeenCalled()
  })
})
