// components/shared/index.ts
//
// Barrel export — import any shared component from "@/components/shared"
//
// Usage:
//   import { StatsRow, ValuesSection, Timeline, TeamSection, TeamCarousel, TestimonialCarousel, PageCTA, SectionHeader } from "@/components/shared";

export { StatsRow } from "./StatsRow";
export type { StatItem } from "./StatsRow";

export { ValuesSection } from "./ValuesSection";
export type { ValueItem } from "./ValuesSection";

export { Timeline } from "./Timeline";
export type { TimelineItem } from "./Timeline";

export { TeamSection } from "./TeamSection";
export type { TeamMember, TeamMemberSocial } from "./TeamSection";

export { TeamCarousel } from "./TeamCarousel";
export type { TeamCarouselProps, TeamDialogLabels } from "./TeamCarousel";

export { TestimonialCarousel } from "./TestimonialCarousel";
export type { TestimonialCarouselProps } from "./TestimonialCarousel";

export { PageCTA } from "./PageCTA";

export { SectionHeader } from "./SectionHeader";