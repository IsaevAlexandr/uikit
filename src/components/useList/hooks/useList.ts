/* eslint-disable valid-jsdoc */
import type {
    InitialListParsedState,
    ListItemId,
    ListItemType,
    ListParsedState,
    ListState,
} from '../types';

import {useFlattenListItems} from './useFlattenListItems';
import {useListParsedState} from './useListParsedState';
import {useListState} from './useListState';

export interface UseListProps<T> {
    items: ListItemType<T>[];
    /**
     * Control expanded items state from external source
     */
    getItemId?(item: T): ListItemId;
    /**
     * Expandable state for group items (has children's)
     */
    rootNodesGroups?: boolean;
    defaultGroups?: 'expanded' | 'closed';
    initialValues?: Partial<InitialListParsedState>;
    // TODO: описать, зачем это нужно, подмешать стейт
    mixState?: Partial<InitialListParsedState>;

    // TODO: описание, что initialValues применятеся при смене значения items
    loading?: boolean;
}

export type UseListResult<T> = {
    listState: ListState;
    list: ListParsedState<T>;
};

/**
 * Take array of items as a argument with params described what type of list initial data represents.
 */
export const useList = <T>({
    items,
    getItemId,
    defaultGroups = 'expanded',
    rootNodesGroups = true,
    initialValues,
    mixState,
    loading,
}: UseListProps<T>): UseListResult<T> => {
    const {itemsById, groupsState, itemsState, initialState} = useListParsedState({
        items,
        getItemId,
        groupsDefaultState: defaultGroups,
    });

    let listState = useListState({
        initialValues: initialValues ?? initialState,
        rootNodesGroups,
        controlled: typeof loading !== 'undefined' && !loading, // controlled only if passed `loading` prop explicitly
    });

    const {visibleFlattenIds, idToFlattenIndex, itemsSchema} = useFlattenListItems({
        items,
        /**
         * By default controlled from list items declaration state
         */
        expandedById: listState.expandedById,
        getItemId,
    });

    if (mixState) {
        listState = {
            ...listState,
            ...mixState,
        };
    }

    return {
        listState,
        list: {
            itemsSchema,
            items,
            visibleFlattenIds,
            idToFlattenIndex,
            itemsById,
            groupsState,
            itemsState,
        },
    };
};
