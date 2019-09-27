import { Directive, ElementRef, Renderer, Input } from '@angular/core';

@Directive({
  selector: '[appAutofocuse]'
})
export class AutofocuseDirective {

  constructor(private elementRef: ElementRef) { };

  ngOnInit(): void {
    this.elementRef.nativeElement.focus();
  }

}
