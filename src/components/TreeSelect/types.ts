import type React from 'react';

import type {PopperPlacement} from '../../hooks/private';
import type {UseOpenProps} from '../../hooks/useSelect/types';
import type {SelectPopupProps} from '../Select/components/SelectPopup/types';
import type {
    TreeListOnItemClick,
    TreeListProps,
    TreeListRenderContainer,
    TreeListRenderContainerProps,
    TreeListRenderItem,
} from '../TreeList/types';
import type {ListItemId, ListItemSize, ListItemType} from '../useList';

export type TreeSelectRenderControlProps = {
    open: boolean;
    toggleOpen(): void;
    clearValue(): void;
    ref: React.Ref<HTMLButtonElement>;
    size: ListItemSize;
    value: ListItemId[];
    id: string;
    activeItemId?: ListItemId;
    title?: string;
    hasClear?: boolean;
};

export type TreeSelectRenderItem<T, P extends {} = {}> = TreeListRenderItem<T, P>;
export type TreeSelectRenderContainerProps<T> = TreeListRenderContainerProps<T>;
export type TreeSelectRenderContainer<T> = TreeListRenderContainer<T>;
export type TreeSelectOnItemClick<T> = TreeListOnItemClick<T>;

export interface TreeSelectProps<T, P extends {} = {}>
    extends Omit<TreeListProps<T, P>, 'onItemClick' | 'list' | 'listState'>,
        UseOpenProps {
    /**
     * Control's title attribute value
     */
    title?: string;
    items: ListItemType<T>[]; // TODO: можно использовать тип из useList
    rootNodesGroups?: boolean; // TODO: можно использовать тип из useList
    defaultGroups?: 'expanded' | 'closed'; // TODO: можно использовать тип из useList
    /**
     * Define custom id depended on item data value to use in controlled state component variant
     */
    getItemId?(item: T): ListItemId; // TODO: можно использовать тип из useList
    value?: ListItemId[]; // TODO: возможно типы хука
    // defaultOpen?: boolean;
    defaultValue?: ListItemId[];
    onUpdate?(value: ListItemId[], selectedItems: T[]): void;
    // onOpenChange?(open: boolean): void;
    // open?: boolean;
    // id?: string | undefined;
    // setSelected?: ;
    // setExpanded?: ReturnType<typeof useListState>['setExpanded'];
    popupClassName?: string;
    popupWidth?: SelectPopupProps['width'];
    placement?: PopperPlacement;
    width?: 'auto' | 'max' | number;
    containerClassName?: string;
    popupDisablePortal?: boolean;

    filterItem?: (filter: string, item: T) => boolean;
    filterPlaceholder?: string;
    hasClear?: boolean;
    renderFilter?: (props: {
        onChange: (filter: string) => void;
        onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void;
        value: string;
        ref: React.Ref<HTMLInputElement>;
        style: React.CSSProperties;
    }) => React.ReactElement;

    filterable?: boolean;
    onFilterChange?: (filter: string) => void;
    renderEmptyOptions?: ({filter}: {filter: string}) => React.ReactElement;

    // /**
    //  * The ability to set the default behavior for group elements
    //  *
    //  * - `expandable`. Click on group item will be produce internal `expanded` state toggle
    //  * - `selectable`. Click on group item will be produce internal `selected` state toggle
    //  *
    //  * @default - 'expandable
    //  */
    // groupsBehavior?: 'expandable' | 'selectable';
    /**
     * Use slots if you don't need access to internal TreeListState.
     * In other situations use `renderContainer` method
     */
    slotBeforeListBody?: React.ReactNode;
    /**
     * Use slots if you don't need access to internal TreeListState.
     * In other situations use `renderContainer` method
     */
    slotAfterListBody?: React.ReactNode;
    /**
     * Ability to override custom toggler btn
     */
    renderControl?(props: TreeSelectRenderControlProps): React.JSX.Element;
    /**
     * Override list item content by you custom node.
     */
    // renderItem?: TreeSelectRenderItem<T, P>;
    renderContainer?: TreeSelectRenderContainer<T>;

    onFocus?: (e: React.FocusEvent) => void;
    onBlur?: (e: React.FocusEvent) => void;
    /**
     * You can user default onItemClick handles as second argument here
     * ```tsx
     * onItemClick={(ctx, cb) => {
     *  // do something with item click context here
     *
     *  cb(); // call default on item click handler
     * }}
     * ```
     */
    // onItemClick?: TreeSelectOnItemClick<T>;
}
