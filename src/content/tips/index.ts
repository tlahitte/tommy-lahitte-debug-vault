import type { Tip } from '@/lib/types'

// Original 3 tips
import { tip as visualLoggerTip } from './debugging-visual-logger'
import { tip as functionalTestTip } from './qa-workflow-test-blueprint-automation'
import { tip as outputLogTip } from './editor-output-log-filters'

// Tips imported from Notion "Useful Stuff" page
import { tip as restartGraphicsDriverTip } from './debugging-restart-graphics-driver'
import { tip as tdrDelayTip } from './debugging-tdr-delay'
import { tip as dx12CrashFlagsTip } from './debugging-dx12-crash-flags'
import { tip as stomp2MallocTip } from './debugging-stomp2malloc'
import { tip as memoryLlmTip } from './debugging-memory-llm'
import { tip as logVerbosityTip } from './debugging-log-verbosity'
import { tip as windowsLongPathTip } from './editor-windows-long-path'
import { tip as packageCompatibilityTip } from './editor-package-compatibility'
import { tip as generateProjectFilesTip } from './editor-generate-project-files'
import { tip as unrealBuildAcceleratorTip } from './editor-unreal-build-accelerator'
import { tip as perforceCliTip } from './qa-workflow-perforce-cli'
import { tip as unrealInsightsTraceTip } from './qa-workflow-unreal-insights-trace'
import { tip as colorScienceTip } from './editor-color-science-unreal'
import { tip as downgradeAssetTip } from './editor-downgrade-unreal-asset'
import { tip as centralizedPluginTip } from './editor-centralized-plugin-ugs'
import { tip as linuxUgsTip } from './editor-unreal-linux-perforce-ugs'
import { tip as contentBrowserMetadataTip } from './editor-content-browser-metadata-search'

export const allTips: Tip[] = [
  visualLoggerTip,
  functionalTestTip,
  outputLogTip,
  restartGraphicsDriverTip,
  tdrDelayTip,
  dx12CrashFlagsTip,
  stomp2MallocTip,
  memoryLlmTip,
  logVerbosityTip,
  windowsLongPathTip,
  packageCompatibilityTip,
  generateProjectFilesTip,
  unrealBuildAcceleratorTip,
  perforceCliTip,
  unrealInsightsTraceTip,
  colorScienceTip,
  downgradeAssetTip,
  centralizedPluginTip,
  linuxUgsTip,
  contentBrowserMetadataTip,
]
