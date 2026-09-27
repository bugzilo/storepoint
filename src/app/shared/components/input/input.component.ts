import {
  Component,
  computed,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

export type InputSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'stp-input',
  imports: [FormsModule, NgClass, IconComponent],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  /** Floating label text. When omitted, no label is rendered. */
  readonly label = input<string>('');
  readonly type = input<string>('text');
  readonly size = input<InputSize>('md');
  readonly hasError = input<boolean>(false);
  readonly id = input<string>('stp-' + Math.random().toString(36).slice(2, 7));
  readonly autocomplete = input<string>('off');
  readonly placeholder = input<string>('');

  readonly value = model<string>('');

  protected readonly focused = signal(false);
  protected readonly disabled = signal(false);

  /** true when type is password — enables built-in show/hide toggle */
  protected readonly isPassword = computed(() => this.type() === 'password');

  /** Native picker types (date, time, etc.) display default browser prompts (e.g. dd/mm/yyyy) */
  protected readonly isDateOrTimeType = computed(() => {
    const t = this.type();
    return (
      t === 'date' ||
      t === 'datetime-local' ||
      t === 'time' ||
      t === 'month' ||
      t === 'week'
    );
  });

  /** Tracks whether password is currently visible */
  protected readonly showPassword = signal(false);
  protected readonly toggleRippleActive = signal(false);
  private toggleRippleTimer = 0;

  /** Actual input type: toggles between 'password' and 'text' */
  protected readonly resolvedType = computed(() => {
    if (this.isPassword()) {
      return this.showPassword() ? 'text' : 'password';
    }
    return this.type();
  });

  /** Label floats when focused, has value, has placeholder, or is a native date/time picker */
  protected readonly floated = computed(
    () =>
      this.focused() ||
      (this.value()?.length ?? 0) > 0 ||
      this.isDateOrTimeType() ||
      !!this.placeholder(),
  );

  protected readonly hostClasses = computed(() => ({
    'stp-wrapper': true,
    [`stp-wrapper--${this.size()}`]: true,
    'stp-focused': this.focused(),
    'stp-floated': this.floated(),
    'stp-disabled': this.disabled(),
    'stp-error': this.hasError(),
    'stp-no-label': !this.label(),
    'stp-is-date': this.isDateOrTimeType(),
  }));

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  protected togglePassword(): void {
    this.showPassword.update(v => !v);
    clearTimeout(this.toggleRippleTimer);
    this.toggleRippleActive.set(false);
    requestAnimationFrame(() => {
      this.toggleRippleActive.set(true);
      this.toggleRippleTimer = window.setTimeout(() => this.toggleRippleActive.set(false), 600);
    });
  }

  protected onFocus(): void {
    this.focused.set(true);
  }

  protected onBlur(): void {
    this.focused.set(false);
    this.onTouched();
  }

  protected onInput(event: Event): void {
    const v = (event.target as HTMLInputElement).value;
    this.value.set(v);
    this.onChange(v);
  }

  // ControlValueAccessor
  writeValue(v: string): void {
    this.value.set(v ?? '');
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
