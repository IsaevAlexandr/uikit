import React from 'react';

import {Label} from '../../../Label';
import {Loader} from '../../../Loader';
import {Flex, spacing} from '../../../layout';
import {ListItemView, useList} from '../../../useList';
import {IntersectionContainer} from '../../../useList/__stories__/components/IntersectionContainer/IntersectionContainer';
import {useInfinityFetch} from '../../../useList/__stories__/utils/useInfinityFetch';
import {TreeList} from '../../TreeList';
import type {TreeListProps} from '../../types';
import {RenderVirtualizedContainer} from '../components/RenderVirtualizedContainer';

function identity<T>(value: T): T {
    return value;
}

export interface InfinityScrollStoryProps
    extends Omit<
        TreeListProps<{title: string}>,
        'value' | 'onUpdate' | 'items' | 'multiple' | 'size' | 'mapItemDataToProps'
    > {
    itemsCount?: number;
}

const multiple = true;

export const InfinityScrollStory = ({itemsCount = 5, ...storyProps}: InfinityScrollStoryProps) => {
    const {
        data: items = [],
        onFetchMore,
        canFetchMore,
        isLoading,
    } = useInfinityFetch<{title: string}>(itemsCount, true);

    const {list, listState} = useList({
        items,
        loading: isLoading,
    });

    return (
        <Flex direction="column">
            <TreeList<{title: string}>
                {...storyProps}
                size="l"
                list={list}
                listState={listState}
                mapItemDataToProps={identity}
                multiple={multiple}
                renderItem={({data, props, context: {isLastItem, groupState}}) => {
                    const node = (
                        <ListItemView
                            {...props}
                            {...data}
                            endSlot={
                                groupState ? (
                                    <Label>{groupState.childrenIds.length}</Label>
                                ) : undefined
                            }
                        />
                    );

                    if (isLastItem) {
                        return (
                            <IntersectionContainer
                                onIntersect={canFetchMore ? onFetchMore : undefined}
                            >
                                {node}
                            </IntersectionContainer>
                        );
                    }

                    return node;
                }}
                renderContainer={RenderVirtualizedContainer}
            />
            {isLoading && (
                <Flex justifyContent="center" className={spacing({py: 2})}>
                    <Loader size={'m'} />
                </Flex>
            )}
        </Flex>
    );
};
