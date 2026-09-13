import { describe, expect, it } from 'vitest'
import type { SessionEvent } from '@deepseek-ai/dsh-session'
import { foldSubagentDescriptor } from '../src/descriptor.ts'

const event = (data: unknown) => ({ type: 'subagent/descriptor', seq: 0, time: 1, data }) as SessionEvent

describe('released descriptor v2 history', () => {
  it('preserves an explicitly empty historical persona', () => {
    const old = Object.freeze({ version: 2, mode: 'continuable', provider: 'spawn', label: 'child', persona: '' })
    expect(foldSubagentDescriptor([event(old)])).toEqual({ ...old, version: 3 })
    expect(old).toEqual({ version: 2, mode: 'continuable', provider: 'spawn', label: 'child', persona: '' })
  })
  it('normalizes a detached continuable descriptor without mutating the saved record', () => {
    const old = Object.freeze({ version: 2, mode: 'continuable', provider: 'spawn', label: 'child', agentProvider: 'mock', agentModel: 'mock', toolFilter: { deny: ['write'] } })
    const restored = foldSubagentDescriptor([event(old)])
    expect(restored).toEqual({ ...old, version: 3 })
    expect(restored).not.toBe(old)
    expect(restored).not.toHaveProperty('agentReasoningEffort')
    expect(old.version).toBe(2)
  })
  it('preserves one-shot identity and rejects new fields in old records', () => {
    expect(foldSubagentDescriptor([event({ version: 2, mode: 'one-shot', provider: 'spawn' })])).toEqual({ version: 3, mode: 'one-shot', provider: 'spawn' })
    expect(() => foldSubagentDescriptor([event({ version: 2, mode: 'continuable', provider: 'spawn', label: 'child', agentReasoningEffort: 'high' })])).toThrow('version 2 cannot declare agentReasoningEffort')
    expect(foldSubagentDescriptor([event({ version: 4, mode: 'one-shot', provider: 'spawn' })])).toBeUndefined()
  })
})
