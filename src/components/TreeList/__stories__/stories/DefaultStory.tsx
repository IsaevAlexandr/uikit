import React from 'react';

import {Text} from '../../../Text';
import {Flex} from '../../../layout';
import {useList} from '../../../useList';
import {createRandomizedData} from '../../../useList/__stories__/utils/makeData';
import {TreeList} from '../../TreeList';
import type {TreeListProps} from '../../types';

function identity<T>(value: T): T {
    return value;
}

export interface DefaultStoryProps
    extends Omit<TreeListProps<{title: string}>, 'items' | 'mapItemDataToProps'> {
    itemsCount?: number;
}

export const DefaultStory = ({itemsCount = 5, ...props}: DefaultStoryProps) => {
    const items = React.useMemo(() => createRandomizedData({num: itemsCount}), [itemsCount]);

    const listWithGroups = useList({
        items,
    });
    const listWithNoGroups = useList({
        items,
        rootNodesGroups: false,
    });

    return (
        <Flex gap="5">
            <Flex direction={'column'} gap="3">
                <Text color="secondary">Default TreeList</Text>
                <TreeList
                    {...props}
                    {...listWithGroups}
                    onItemClick={null}
                    mapItemDataToProps={identity}
                />
            </Flex>
            <Flex direction={'column'} gap="3">
                <Text color="secondary">List with `rootNodesGroups` false option in listState</Text>

                <TreeList
                    {...props}
                    {...listWithNoGroups}
                    onItemClick={null}
                    mapItemDataToProps={identity}
                />
            </Flex>
        </Flex>
    );
};
