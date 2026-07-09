import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
    selector: 'input[type="number"]',
    standalone: true,
})
export class NoWheelNumberDirective {

    constructor(private el: ElementRef<HTMLInputElement>) { }

    @HostListener('wheel', ['$event'])
    onWheel(event: WheelEvent): void {
        if (document.activeElement === this.el.nativeElement) {
            event.preventDefault();
        }
    }
}