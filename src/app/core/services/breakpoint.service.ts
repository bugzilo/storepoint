import { Injectable, computed, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { Capacitor } from '@capacitor/core';

/**
 * Breakpoint values mirroring src/app/shared/styles/_breakpoints.scss:
 *   $xs: 480px;
 *   $sm: 640px;
 *   $md: 768px;
 */
export const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
} as const;

export const MEDIA_QUERIES = {
  /** ≤ 479px (xs-down) */
  xsDown: `(max-width: ${BREAKPOINTS.xs - 1}px)`,
  /** ≥ 480px (xs-up) */
  xsUp: `(min-width: ${BREAKPOINTS.xs}px)`,
  /** ≤ 639px (mobile-only) */
  mobile: `(max-width: ${BREAKPOINTS.sm - 1}px)`,
  /** ≥ 640px (tablet / desktop - sm-up) */
  smUp: `(min-width: ${BREAKPOINTS.sm}px)`,
  /** ≥ 768px (desktop - md-up) */
  mdUp: `(min-width: ${BREAKPOINTS.md}px)`,
} as const;

@Injectable({ providedIn: 'root' })
export class BreakpointService {
  private readonly observer = inject(BreakpointObserver);

  // Platform info (Capacitor)
  /** True when running inside native iOS/Android container */
  readonly isNative = Capacitor.isNativePlatform();
  /** Current runtime platform: 'web' | 'ios' | 'android' */
  readonly platform = Capacitor.getPlatform();

  // Screen size signals aligned with _breakpoints.scss
  /** True when viewport width is ≤ 639px (matches @include bp.mobile-only) */
  readonly isMobile = toSignal(
    this.observer.observe(MEDIA_QUERIES.mobile).pipe(map((result) => result.matches)),
    { initialValue: this.observer.isMatched(MEDIA_QUERIES.mobile) },
  );

  /** True when viewport width is ≥ 640px (matches @include bp.sm-up) */
  readonly isDesktop = computed(() => !this.isMobile());

  /** True when viewport width is ≥ 768px (matches @include bp.md-up) */
  readonly isMdUp = toSignal(
    this.observer.observe(MEDIA_QUERIES.mdUp).pipe(map((result) => result.matches)),
    { initialValue: this.observer.isMatched(MEDIA_QUERIES.mdUp) },
  );

  /** True when between 640px and 767px (Tablet) */
  readonly isTablet = computed(() => !this.isMobile() && !this.isMdUp());

  /** True when viewport width is ≤ 479px (matches @include bp.xs-down) */
  readonly isXsDown = toSignal(
    this.observer.observe(MEDIA_QUERIES.xsDown).pipe(map((result) => result.matches)),
    { initialValue: this.observer.isMatched(MEDIA_QUERIES.xsDown) },
  );
}
