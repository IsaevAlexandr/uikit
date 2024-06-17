import React from 'react';

import get from 'lodash/get';

import {TextInput} from '../../../controls';
import {Flex} from '../../../layout';
import {ListContainerView} from '../../components/ListContainerView/ListContainerView';
import {ListItemView} from '../../components/ListItemView/ListItemView';
import {useList} from '../../hooks/useList';
import {useListFilter} from '../../hooks/useListFilter';
import {useListItemClick} from '../../hooks/useListItemClick';
import {useListKeydown} from '../../hooks/useListKeydown';
import type {ListItemSize} from '../../types';
import {computeItemSize} from '../../utils/computeItemSize';
import {getItemRenderState} from '../../utils/getItemRenderState';
import {createRandomizedData} from '../utils/makeData';

import {VirtualizedListContainer} from './VirtualizedListContainer';

export interface FlattenListProps {
    itemsCount: number;
    size: ListItemSize;
}

export const FlattenList = ({itemsCount, size}: FlattenListProps) => {
    const containerRef = React.useRef(null);
    const items = React.useMemo(
        () => createRandomizedData<{title: string}>({num: itemsCount}),
        [itemsCount],
    );

    const filterState = useListFilter({items});

    const list = useList({items: filterState.items});

    const onItemClick = useListItemClick({list});

    useListKeydown({
        containerRef,
        onItemClick,
        list,
    });

    return (
        <Flex direction="column" gap="5" grow>
            <TextInput
                autoComplete="off"
                value={filterState.filter}
                onUpdate={filterState.onFilterUpdate}
                ref={filterState.filterRef}
            />

            <ListContainerView ref={containerRef}>
                <VirtualizedListContainer
                    items={list.structure.visibleFlattenIds}
                    itemSize={(index) =>
                        computeItemSize(
                            size,
                            Boolean(
                                get(
                                    list.structure.itemsById[
                                        list.structure.visibleFlattenIds[index]
                                    ],
                                    'subtitle',
                                ),
                            ),
                        )
                    }
                >
                    {(id) => {
                        const {props} = getItemRenderState({
                            id,
                            size,
                            onItemClick,
                            mapItemDataToProps: (x) => x,
                            list,
                        });
                        return <ListItemView {...props} hasSelectionIcon={false} />;
                    }}
                </VirtualizedListContainer>
            </ListContainerView>
        </Flex>
    );
};
