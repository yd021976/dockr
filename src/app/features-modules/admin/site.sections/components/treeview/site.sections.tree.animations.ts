import { trigger, style, transition, animate, query, animateChild, group } from '@angular/animations';

export const nodeAnimations = [
    trigger('animChildren', [
        transition('*<=>*',
            [
                query('@*', animateChild(), { optional: true })
            ])
    ]),
    trigger('EnterLeave', [
        transition(':enter', [
            style({ 'min-height': '0px', 'max-height': '0px', 'height': '0px' }),
            group([
                query("@*", animateChild(), { optional: true }),
                animate('0.2s 50ms ease', style({ 'max-height': '*', 'min-height': '*', 'height': '*' }))
            ])
        ]),
        transition(':leave', [
            style({ 'min-height': '*' }),
            group([
                query("@*", animateChild(), { optional: true }),
                animate('0.2s 50ms ease', style({ 'min-height': '0px', 'height': '0px' }))
            ])
        ])
    ])
]