import React from 'react';

import type popper from '@popperjs/core';
import {usePopper as useReactPopper} from 'react-popper';
import type {Modifier} from 'react-popper';

export type PopperPlacement = popper.Placement | popper.Placement[];
export type PopperOffset = [number, number];
export type PopperModifiers = Modifier<unknown, Record<string, unknown>>[];
export type PopperAnchorRef = React.RefObject<Element | popper.VirtualElement>;

export interface PopperProps {
    anchorRef?: PopperAnchorRef;
    placement?: PopperPlacement;
    offset?: [number, number];
    modifiers?: PopperModifiers;
    strategy?: popper.PositioningStrategy;
    altBoundary?: boolean;
}

export interface UsePopperProps extends PopperProps {}

export interface UsePopperResult {
    attributes: {
        [key: string]:
            | {
                  [key: string]: string;
              }
            | undefined;
    };
    styles: {
        [key: string]: React.CSSProperties;
    };
    setPopperRef: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
    setArrowRef: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

const DEFAULT_PLACEMENT: PopperPlacement = [
    'bottom-start',
    'bottom',
    'bottom-end',
    'top-start',
    'top',
    'top-end',
    'right-start',
    'right',
    'right-end',
    'left-start',
    'left',
    'left-end',
];

export function usePopper({
    anchorRef,
    placement = DEFAULT_PLACEMENT,
    offset,
    modifiers = [],
    strategy,
    altBoundary,
}: UsePopperProps): UsePopperResult {
    const [popperElement, setPopperElement] = React.useState<HTMLElement | null>(null);
    const [arrowElement, setArrowElement] = React.useState<HTMLElement | null>(null);
    const placements = Array.isArray(placement) ? placement : [placement];

    const {attributes, styles} = useReactPopper(anchorRef?.current, popperElement, {
        strategy,
        modifiers: [
            {name: 'arrow', options: {element: arrowElement}},
            {name: 'offset', options: {offset, altBoundary}},
            {name: 'flip', options: {fallbackPlacements: placements.slice(1), altBoundary}},
            ...modifiers,
        ],
        placement: placements[0],
    });

    return {
        attributes,
        styles,
        setPopperRef: setPopperElement,
        setArrowRef: setArrowElement,
    };
}
