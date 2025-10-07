import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class Highlight {
  @Input() appHighlight = 'gold';

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    const element = this.el.nativeElement;
    if (element.tagName === 'IMG') {
      element.style.boxShadow = `0 0 15px ${this.appHighlight}`;
      element.style.transform = 'scale(1.05)';
      element.style.transition = 'all 0.3s ease';
    } else {
      element.style.color = this.appHighlight;
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    const element = this.el.nativeElement;
    if (element.tagName === 'IMG') {
      element.style.boxShadow = 'none';
      element.style.transform = 'scale(1)';
    } else {
      element.style.color = null;
    }
  }
}


