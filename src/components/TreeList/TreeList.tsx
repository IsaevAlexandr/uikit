import React from 'react';

import {useUniqId} from '../../hooks';
import {ListItemView, getItemRenderState, useListItemClick, useListKeydown} from '../useList';
import {block} from '../utils/cn';

import {TreeListContainer} from './components/TreeListContainer/TreeListContainer';
import type {TreeListProps, TreeListRenderContainerProps} from './types';

const b = block('tree-list');

export const TreeList = <T,>({
    qa,
    id,
    size = 'm',
    className,
    list,
    listState,
    renderItem: propsRenderItem,
    renderContainer = TreeListContainer,
    onItemClick: propsOnItemClick,
    multiple,
    containerRef: propsContainerRef,
    mapItemDataToProps,
}: TreeListProps<T>) => {
    const uniqId = useUniqId();
    const treeListId = id ?? uniqId;
    const containerRefLocal = React.useRef<HTMLDivElement>(null);
    const containerRef = propsContainerRef ?? containerRefLocal;

    const {onItemClick: defaultOnItemClick} = useListItemClick(listState, {multiple});
    // TODO: заменить во всех сторисах
    const onItemClick =
        propsOnItemClick === null ? undefined : propsOnItemClick ?? defaultOnItemClick;

    useListKeydown({
        containerRef,
        onItemClick,
        ...list,
        ...listState,
    });

    const renderItem: TreeListRenderContainerProps<T>['renderItem'] = (
        itemId,
        index,
        renderContainerProps,
    ) => {
        const renderState = getItemRenderState({
            qa,
            id: itemId,
            size,
            multiple,
            mapItemDataToProps,
            onItemClick,
            ...list,
            ...listState,
        });

        if (propsRenderItem) {
            return propsRenderItem({
                data: renderState.data,
                props: renderState.props,
                context: renderState.context,
                index,
                renderContainerProps,
            });
        }

        return <ListItemView {...renderState.props} {...renderContainerProps} />;
    };

    // not JSX decl here is from weird `react-beautiful-dnd` render bug
    return renderContainer({
        qa,
        id: `list-${treeListId}`,
        size,
        containerRef,
        className: b(null, className),
        ...list,
        ...listState,
        renderItem,
    });
};
