import { z } from 'zod'
import type { RendererToMainEvent } from './types.js'

const point = z.object({ x: z.number().finite(), y: z.number().finite() }).strict()

export const RendererToMainEventSchema = z.discriminatedUnion('name', [
  z.object({ name: z.literal('OVERLAY->MAIN::focus-game'), payload: z.undefined() }).strict(),
  z.object({
    name: z.literal('OVERLAY->MAIN::track-area'),
    payload: z.object({
      holdKey: z.string(),
      closeThreshold: z.number().finite(),
      from: point,
      area: point.extend({ width: z.number().finite(), height: z.number().finite() }),
      dpr: z.number().finite()
    }).strict()
  }).strict(),
  z.object({
    name: z.literal('CLIENT->MAIN::update-host-config'),
    payload: z.object({
      shortcuts: z.array(z.unknown()),
      restoreClipboard: z.boolean(),
      clientLog: z.string().nullable(),
      gameConfig: z.string().nullable(),
      stashScroll: z.boolean(),
      overlayKey: z.string(),
      logKeys: z.boolean(),
      windowTitle: z.string(),
      language: z.string()
    }).strict()
  }).strict(),
  z.object({ name: z.literal('CLIENT->MAIN::used-recently'), payload: z.object({ isOverlay: z.boolean() }).strict() }).strict(),
  z.object({ name: z.literal('CLIENT->MAIN::save-config'), payload: z.object({ contents: z.string(), isTemporary: z.boolean() }).strict() }).strict(),
  z.object({
    name: z.literal('CLIENT->MAIN::user-action'),
    payload: z.discriminatedUnion('action', [
      z.object({ action: z.literal('check-for-update') }).strict(),
      z.object({ action: z.literal('update-and-restart') }).strict(),
      z.object({ action: z.literal('quit') }).strict(),
      z.object({ action: z.literal('stash-search'), text: z.string() }).strict()
    ])
  }).strict()
])

export function parseRendererToMainEvent (value: unknown): RendererToMainEvent | undefined {
  const result = RendererToMainEventSchema.safeParse(value)
  return result.success ? result.data as RendererToMainEvent : undefined
}
