import type React from 'react';

import type {QAProps} from '../types';
import type {
    ListItemCommonProps,
    ListItemId,
    ListItemSize,
    ListParsedState,
    ListState,
    RenderItemContext,
    RenderItemProps,
    UseListResult,
} from '../useList';

export type TreeListRenderItem<T, P extends {} = {}> = (props: {
    data: T;
    // required item props to render
    props: RenderItemProps;
    // internal list context props
    context: RenderItemContext;
    index: number;
    renderContainerProps?: P;
}) => React.JSX.Element;

interface ItemClickContext<T> {
    id: ListItemId;
    data: T;
    index: number;
    isGroup: boolean;
    /**
     * Current item `disabled` value
     */
    disabled: boolean;
    /**
     * Current item `selected` value
     */
    selected: boolean;
    /**
     * Current item `expanded` value for group
     * // TODO: подкорректировать коммент
     */
    expanded?: boolean;
    /**
     * List content item info
     */
    context: RenderItemContext;
}

export type TreeListOnItemClick<T> = (ctx: ItemClickContext<T>) => void;

export type TreeListRenderContainerProps<T> = ListParsedState<T> &
    QAProps &
    Partial<ListState> & {
        id: string;
        size: ListItemSize;
        containerRef?: React.RefObject<HTMLDivElement>;
        className?: string;
        // /**
        //  * Define custom id depended on item data value to use in controlled state component variant
        //  */
        // getItemId?(item: T): ListItemId;
        renderItem(
            id: ListItemId,
            index: number,
            /**
             * Ability to transfer props from an overridden container render
             */
            renderContainerProps?: Object,
        ): React.JSX.Element;
    };

export type TreeListRenderContainer<T> = (
    props: TreeListRenderContainerProps<T>,
) => React.JSX.Element;

export type TreeListMapItemDataToProps<T> = (item: T) => ListItemCommonProps;

export interface TreeListProps<T, P extends {} = {}> extends QAProps, UseListResult<T> {
    /**
     * Control outside list container dom element. For example for keyboard
     */
    containerRef?: React.RefObject<HTMLDivElement>;
    id?: string | undefined;
    className?: string;
    // items: ListItemType<T>[];
    multiple?: boolean;
    size?: ListItemSize;
    // /**
    //  * Define custom id depended on item data value to use in controlled state component variant
    //  */
    // getItemId?(item: T): ListItemId;
    /**
     * Override list item content by you custom node.
     */
    renderItem?: TreeListRenderItem<T, P>;
    renderContainer?: TreeListRenderContainer<T>;
    /**
     * `null` value - if for some reason you don't need default click item behavior
     */
    onItemClick?: null | ((id: ListItemId) => void);
    mapItemDataToProps: TreeListMapItemDataToProps<T>;
}
