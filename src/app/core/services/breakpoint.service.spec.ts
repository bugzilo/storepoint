import { TestBed } from '@angular/core/testing';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BreakpointService, MEDIA_QUERIES } from './breakpoint.service';

describe('BreakpointService', () => {
  let service: BreakpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BreakpointService, BreakpointObserver],
    });
    service = TestBed.inject(BreakpointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should define media queries matching _breakpoints.scss', () => {
    expect(MEDIA_QUERIES.mobile).toBe('(max-width: 639px)');
    expect(MEDIA_QUERIES.smUp).toBe('(min-width: 640px)');
    expect(MEDIA_QUERIES.mdUp).toBe('(min-width: 768px)');
    expect(MEDIA_QUERIES.xsDown).toBe('(max-width: 479px)');
  });

  it('should have isMobile and isDesktop signals defined', () => {
    expect(typeof service.isMobile()).toBe('boolean');
    expect(typeof service.isDesktop()).toBe('boolean');
    expect(service.isDesktop()).toBe(!service.isMobile());
  });
});
