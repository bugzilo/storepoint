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

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export type SelectSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'stp-select',
  imports: [FormsModule, NgClass, IconComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  /** Floating label text. When omitted, no label is rendered. */
  readonly label = input<string>('');
  /** Placeholder text shown when no option is selected. Defaults to empty. */
  readonly placeholder = input<string>('');
  readonly options = input<SelectOption[]>([]);
  readonly hasError = input<boolean>(false);
  readonly size = input<SelectSize>('md');
  readonly id = input<string>('stp-' + Math.random().toString(36).slice(2, 7));

  readonly value = model<string | number>('');

  protected readonly focused = signal(false);
  protected readonly disabled = signal(false);

  protected readonly hasValue = computed(() => {
    const v = this.value();
    return v !== '' && v !== null && v !== undefined;
  });

  protected readonly effectivePlaceholder = computed(() => {
    const p = this.placeholder();
    if (p) return p;
    return this.label() ? '' : 'Selecciona una opción';
  });

  /** Label floats when focused or when a value is selected */
  protected readonly floated = computed(
    () => this.focused() || this.hasValue(),
  );

  protected readonly hostClasses = computed(() => ({
    'stp-select-wrapper': true,
    [`stp-select-wrapper--${this.size()}`]: true,
    'stp-focused': this.focused(),
    'stp-floated': this.floated(),
    'stp-disabled': this.disabled(),
    'stp-error': this.hasError(),
    'stp-no-label': !this.label(),
  }));

  private onChange: (v: string | number) => void = () => {};
  private onTouched: () => void = () => {};

  protected onFocus(): void {
    this.focused.set(true);
  }

  protected onBlur(): void {
    this.focused.set(false);
    this.onTouched();
  }

  protected onSelectChange(event: Event): void {
    const rawVal = (event.target as HTMLSelectElement).value;
    const matchingOpt = this.options().find(opt => String(opt.value) === rawVal);
    const v = matchingOpt !== undefined ? matchingOpt.value : rawVal;
    this.value.set(v);
    this.onChange(v);
  }

  writeValue(v: string | number): void {
    this.value.set(v ?? '');
  }

  registerOnChange(fn: (v: string | number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
