import React from 'react';

import type {ListItemId, UseList} from '../../types';
import {ListContainerView} from '../ListContainerView';
import type {ListContainerViewProps} from '../ListContainerView/ListContainerView';
import {ListItemRecursiveRenderer} from '../ListRecursiveRenderer/ListRecursiveRenderer';

export type ListContainerProps<T> = Omit<ListContainerViewProps, 'children'> & {
    list: UseList<T>;
    containerRef?: React.RefObject<HTMLDivElement>;
    renderItem(
        id: ListItemId,
        index: number,
        /**
         * Ability to transfer props from an overridden container render
         */
        renderContainerProps?: Object,
    ): React.JSX.Element;
};

export function ListContainer<T>({
    containerRef,
    renderItem,
    list,
    ...props
}: ListContainerProps<T>) {
    return (
        <ListContainerView ref={containerRef} {...props}>
            {list.structure.items.map((item, index) => (
                <ListItemRecursiveRenderer
                    key={index}
                    itemSchema={item}
                    id={list.structure.rootIds[index]}
                    list={list}
                >
                    {renderItem}
                </ListItemRecursiveRenderer>
            ))}
        </ListContainerView>
    );
}
