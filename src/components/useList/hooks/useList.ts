/* eslint-disable valid-jsdoc */
import React from 'react';

import type {InitialListParsedState, UseList} from '../types';

import {useFlattenListItems} from './useFlattenListItems';
import {useListParsedState} from './useListParsedState';
import type {UseListParsedStateProps} from './useListParsedState';
import {useListState} from './useListState';
import type {UseListStateProps} from './useListState';

interface UseListProps<T> extends UseListParsedStateProps<T>, UseListStateProps {
    mixState?: Partial<InitialListParsedState>;
}

/**
 * Take array of items as a argument with params described what type of list initial data represents.
 */
export const useList = <T>({
    items,
    getItemId,
    groupsDefaultState = 'expanded',
    rootNodesGroups = true,
    initialValues,
    mixState,
}: UseListProps<T>): UseList<T> => {
    const {itemsById, groupsState, itemsState, initialState} = useListParsedState({
        items,
        getItemId,
        groupsDefaultState,
    });

    const initValues = React.useMemo(() => {
        return {
            expandedById: {...initialValues?.expandedById, ...initialState.expandedById},
            selectedById: {...initialValues?.selectedById, ...initialState.selectedById},
            disabledById: {...initialValues?.disabledById, ...initialState.disabledById},
        };
    }, [
        initialState.disabledById,
        initialState.expandedById,
        initialState.selectedById,
        initialValues?.disabledById,
        initialValues?.expandedById,
        initialValues?.selectedById,
    ]);

    const innerState = useListState({
        initialValues: initValues,
        rootNodesGroups,
    });

    const {visibleFlattenIds, idToFlattenIndex, rootIds} = useFlattenListItems({
        items,
        /**
         * By default controlled from list items declaration state
         */
        expandedById: innerState.expandedById,
        getItemId,
    });

    const realState = React.useMemo(() => {
        if (mixState) {
            return {
                ...innerState,
                expandedById: {...innerState.expandedById, ...mixState?.expandedById},
                selectedById: {...innerState.selectedById, ...mixState?.selectedById},
                disabledById: {...innerState.disabledById, ...mixState?.disabledById},
            };
        }

        return innerState;
    }, [mixState, innerState]);

    return {
        state: realState,
        structure: {
            rootIds,
            items,
            visibleFlattenIds,
            idToFlattenIndex,
            itemsById,
            groupsState,
            itemsState,
        },
    };
};
