/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';

import type {ListState} from '../types';

interface UseListStateProps {
    // list: ListItemType<T>[];
    /**
     * Initial state values
     */
    initialValues?: Partial<ListState>;
    rootNodesGroups?: boolean;
    /**
     * If passed groups state exists in lost state.
     * Values is default value of it state
     */
    groupsDefaultState?: 'expanded' | 'closed';

    // TODO: описать, как работает
    controlled?: boolean;
}

// TODO: убрать прямой экспорт
export const useListState = ({
    initialValues,
    rootNodesGroups,
    controlled,
}: UseListStateProps): ListState => {
    const initialValuesRef = React.useRef(initialValues);

    const [disabledById, setDisabled] = React.useState(initialValues?.disabledById ?? {});
    const [selectedById, setSelected] = React.useState(initialValues?.selectedById ?? {});
    const [expandedById, setExpanded] = React.useState(initialValues?.expandedById ?? {});
    const [activeItemId, setActiveItemId] = React.useState(initialValues?.activeItemId);

    if (controlled && initialValues && initialValuesRef.current !== initialValues) {
        if (initialValues?.disabledById) {
            setDisabled((prevValues) => ({...initialValues.disabledById, ...prevValues}));
        }
        if (initialValues?.selectedById) {
            setSelected((prevValues) => ({...initialValues.selectedById, ...prevValues}));
        }
        if (initialValues?.expandedById) {
            setExpanded((prevValues) => ({...initialValues.expandedById, ...prevValues}));
        }
        setActiveItemId((prevValue) => prevValue ?? initialValues?.activeItemId);
        initialValuesRef.current = initialValues;
    }

    const result: ListState = {
        disabledById,
        selectedById,
        activeItemId,
        setDisabled,
        setSelected,
        setActiveItemId,
    };

    if (rootNodesGroups) {
        result.expandedById = expandedById;
        result.setExpanded = setExpanded;
    }

    return result;
};
