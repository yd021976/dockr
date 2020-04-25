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
            style({ 'min-height': '0px', 'max-height': '0px', 'height': '0px' , 'opacity':0}),
            group([
                query("@*", animateChild(), { optional: true }),
                animate('0.2s 10ms ease-in', style({ 'max-height': '*', 'min-height': '*', 'height': '*', 'opacity':1 }))
            ])
        ]),
        transition(':leave', [
            style({ 'min-height': '*', 'opacity':1 }),
            group([
                query("@*", animateChild(), { optional: true }),
                animate('0.2s 10ms ease-out', style({ 'min-height': '0px', 'height': '0px', 'opacity':0 }))
            ])
        ])
    ])
]