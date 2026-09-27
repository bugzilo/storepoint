import { Component, computed, inject, input, output } from "@angular/core";
import { IconComponent } from "../icon/icon.component";
import { BreakpointService } from "../../../core/services/breakpoint.service";

export interface SwipeOption {
    label: string;
    icon: string;
    key: string;
    stpClass?: string;
}

@Component({
    selector: 'stp-swipe-item',
    imports: [IconComponent],
    templateUrl: './swipe-item.component.html',
    styleUrls: ['./swipe-item.component.scss'],

})
export class SwipeItemComponent {
    protected startX = 0;
    protected currentX = 0;
    protected offset = 0;

    protected dragging = false;
    protected animate = false;

    readonly options = input<SwipeOption[]>([ { label: 'default', icon: 'trash', key: 'delete', stpClass: 'error-bg' } ]);

    readonly maxSwipe = computed(() =>  -10 + (-80 * this.options().length));

    readonly optionSelected = output<SwipeOption>();

    private readonly breakpointService = inject(BreakpointService);

    onStart(event: PointerEvent) {
        this.dragging = true;
        this.animate = false;
        this.startX = event.clientX;
        (event.target as HTMLElement).setPointerCapture(event.pointerId);
    }
    onMove(event: PointerEvent) {

        if (this.breakpointService.isDesktop()) return;

        if (!this.dragging) return;

        this.currentX = event.clientX;
        let delta = this.currentX - this.startX;

        let newOffset = this.offset + delta;

        // limitar entre cerrado (0) y abierto (maxSwipe)
        this.offset = Math.min(0, Math.max(this.maxSwipe(), newOffset));

        this.startX = this.currentX;
    }

    onEnd() {
        if (!this.dragging) return;

        this.dragging = false;
        this.animate = true;

        // snap automático
        if (this.offset < this.maxSwipe() / 2) {
            this.offset = this.maxSwipe(); // se abre
        } else {
            this.offset = 0; // se cierra
        }
    }
}
