import React from 'react';

import {block} from '../../../utils/cn';
import type {ItemSchema, ListItemId} from '../../types';

import './ListRecursiveRenderer.scss';

const b = block('list-recursive-renderer');

export interface ListRecursiveRendererProps {
    itemSchema: ItemSchema;
    children(id: ListItemId, index: number): React.JSX.Element;
    // index: number;
    // parentId?: string;
    className?: string;
    // getItemId?(item: T): ListItemId;
    style?: React.CSSProperties;
    // idToFlattenIndex: Record<ListItemId, number>;
    // expandedById?: ListState['expandedById'];
}

// Saves the nested html structure for tree data structure
export function ListItemRecursiveRenderer({
    itemSchema,
    // index,
    // parentId,
    ...props
}: ListRecursiveRendererProps) {
    // const groupedId = getGroupItemId(index, parentId);
    const id = itemSchema.id;

    const node = props.children(id, itemSchema.index);

    if (itemSchema.children) {
        // const isExpanded =
        //     props.expandedById && id in props.expandedById ? props.expandedById[id] : true;

        return (
            <ul style={props.style} className={b(null, props.className)} role="group">
                {node}
                {itemSchema.children.map((item, index) => (
                    <ListItemRecursiveRenderer
                        itemSchema={item}
                        key={index}
                        // index={index}
                        {...props}
                    />
                ))}
            </ul>
        );
    }

    return node;
}
