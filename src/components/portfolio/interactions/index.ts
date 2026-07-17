import type { ComponentType } from 'react'
import type { InteractionVariant } from '@/lib/portfolio'
import type { VariantProps } from './parts'
import SplitFold from './SplitFold'
import CurtainRise from './CurtainRise'
import Letterbox from './Letterbox'
import Iris from './Iris'
import ParallaxSlide from './ParallaxSlide'
import DepthPush from './DepthPush'
import StaggerCascade from './StaggerCascade'
import CornerExpand from './CornerExpand'
import KenBurnsSheet from './KenBurnsSheet'

/** Maps a video's `interaction` key to its hover-reveal component. */
export const INTERACTIONS: Record<InteractionVariant, ComponentType<VariantProps>> = {
  'split-fold': SplitFold,
  'curtain-rise': CurtainRise,
  letterbox: Letterbox,
  iris: Iris,
  'parallax-slide': ParallaxSlide,
  'depth-push': DepthPush,
  'stagger-cascade': StaggerCascade,
  'corner-expand': CornerExpand,
  'ken-burns-sheet': KenBurnsSheet,
}
