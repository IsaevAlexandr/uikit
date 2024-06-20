import type {QAProps} from '../types';

export type ListItemId = string;

export type ListItemSize = 's' | 'm' | 'l' | 'xl';
interface ListItemInitialProps {
    /**
     * If you need to control the state from the outside,
     * you can set a unique id for each element
     */
    id?: string;
    /**
     * Initial disabled item state
     */
    disabled?: boolean;
    /**
     * Initial selected item state
     */
    selected?: boolean;
    /**
     * Default expanded state if group
     */
    expanded?: boolean;
}

export type ListFlattenItemType<T> = T extends {} ? T & ListItemInitialProps : T;

export interface ListTreeItemType<T> extends ListItemInitialProps {
    data: T;
    children?: ListTreeItemType<T>[];
}

export type ListItemType<T> = ListTreeItemType<T> | ListFlattenItemType<T>;

export type GroupParsedState = {
    childrenIds: ListItemId[];
};

export type ItemState = {
    parentId?: ListItemId;
    indentation: number;
};

export type ListItemCommonProps = {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    startSlot?: React.ReactNode;
    endSlot?: React.ReactNode;
};

export type ListItemListContextProps = ItemState &
    Partial<GroupParsedState> & {
        isLastItem: boolean;
    };

export type RenderItemProps = {
    size: ListItemSize;
    id: ListItemId;
    onClick: (() => void) | undefined;
    selected: boolean | undefined;
    disabled: boolean;
    expanded: boolean | undefined;
    active: boolean;
    indentation: number;
    hasSelectionIcon?: boolean;
} & ListItemCommonProps &
    QAProps;

export type ParsedState<T> = {
    /**
     * Stored internal meta info about item
     * Note: Groups are also items
     */
    itemsState: Record<ListItemId, ItemState>;
    /**
     * Normalized original data
     */
    itemsById: Record<ListItemId, T>;
    /**
     * Stored info about group items:
     */
    groupsState: Record<ListItemId, GroupParsedState>;
};

type SetStateAction<S> = S | ((prevState: S) => S);

type ListStateHandler<S> = (arg: SetStateAction<S>) => void;

export type ListState = {
    disabledById: Record<ListItemId, boolean>;
    selectedById: Record<ListItemId, boolean>;
    expandedById?: Record<ListItemId, boolean>;
    setExpanded?: ListStateHandler<Record<ListItemId, boolean>>;
    setSelected: ListStateHandler<Record<ListItemId, boolean>>;
    setDisabled: ListStateHandler<Record<ListItemId, boolean>>;
    setActiveItemId: ListStateHandler<ListItemId | undefined>;
    activeItemId?: ListItemId;
};

export type InitialListParsedState = Pick<
    ListState,
    'disabledById' | 'expandedById' | 'selectedById'
>;

export type ItemSchema = {
    id: ListItemId;
    index: number;
    children?: ItemSchema[];
};

export type ParsedFlattenState = {
    /**
     * Original list ordered ids without flatten elements.
     * Use it to get internal item id
     */
    rootIds: ListItemId[];
    visibleFlattenIds: ListItemId[];
    idToFlattenIndex: Record<ListItemId, number>;
};

type ListStructure<T> = ParsedState<T> &
    ParsedFlattenState & {
        items: ListItemType<T>[];
    };

export type UseList<T> = {
    state: ListState;
    structure: ListStructure<T>;
};
