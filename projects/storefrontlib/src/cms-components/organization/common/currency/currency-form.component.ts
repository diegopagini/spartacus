import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Currency } from '@spartacus/core';
import { Observable } from 'rxjs';
import { CurrencyFormComponentService } from './currency-form.service';

@Component({
  selector: 'cx-currency-form',
  templateUrl: './currency-form.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyFormComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyFormComponent implements ControlValueAccessor {
  form: FormGroup = this.formService.getForm();
  currencies$: Observable<Currency[]> = this.formService.getCurrencies();
  protected onChange: (value: object) => void = () => {};
  protected onTouched: () => void = () => {};

  constructor(
    protected formService: CurrencyFormComponentService,
    protected fb: FormBuilder
  ) {}

  writeValue(value: any): void {
    if (value) {
      this.form.setValue(value);
    }
  }

  registerOnChange(fn: (value: object) => void): void {
    console.log('on change');
    this.onChange = fn;
    // TODO:#persist-forms - manage the subscription
    this.form.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: () => void): void {
    console.log('on touch');
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

  // TODO:#persist-forms - is it needed? move the validation somewhere else?
  isNotValid(formControlName: string): boolean {
    return this.isNotValidField(formControlName);
  }

  // TODO:#persist-forms - is it needed? move the validation somewhere else?
  isNotValidField(formControlName: string): boolean {
    const control: AbstractControl = this.form.get(formControlName);
    return control.invalid && control.touched && control.dirty;
  }
}