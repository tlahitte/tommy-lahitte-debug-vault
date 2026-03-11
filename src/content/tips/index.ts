// PHASE 1: DONE
// PHASE 6: Placeholder tips (3 tips). Notion import pending — authenticate Notion MCP and run Phase 6.

import type { Tip } from '@/lib/types'
import { tip as visualLoggerTip } from './debugging-visual-logger'
import { tip as functionalTestTip } from './qa-workflow-test-blueprint-automation'
import { tip as outputLogTip } from './editor-output-log-filters'

export const allTips: Tip[] = [
  visualLoggerTip,
  functionalTestTip,
  outputLogTip,
]
