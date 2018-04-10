import { Directive, ElementRef, HostListener, Input, Renderer } from '@angular/core';
import { Platform } from 'ionic-angular';

@Directive({ selector: '[autoAreatext]' })
export class AutoAreatextDirective {
  minHeight: string="50";
  @Input('autoAreatext') height: string;
  constructor(private el: ElementRef, private renderer: Renderer, public platform: Platform) {
    this.platform.ready().then(() => {
      this.auto();
  });
  }
  auto() {
    if (!this.minHeight) {
      return false
    }
    console.log(this.minHeight)
    
    this.renderer.setElementStyle(this.el.nativeElement, 'height', this.minHeight + 'px');
    if (this.el.nativeElement.scrollHeight > this.minHeight) {
      this.renderer.setElementStyle(this.el.nativeElement, 'height', this.el.nativeElement.scrollHeight + 'px');
      this.renderer.setElementStyle(this.el.nativeElement, 'overflow', 'hidden');
    }
  }

  @HostListener('paste') onPaste() {
    this.auto();
  }
  @HostListener('cut') onCut() {
    this.auto();
  }
  @HostListener('keydown') onKeydown() {
    this.auto();
  }
  @HostListener('keyup') onKeyup() {
    this.auto();
  }
  @HostListener('focus') onFocus() {
    this.auto();
  }
  @HostListener('blur') onBlur() {
    this.auto();
  }
  @HostListener('change') onchange() {
    this.auto();
  }
}