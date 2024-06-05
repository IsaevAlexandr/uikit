import React from 'react';

import {ChevronDown, ChevronUp, Database, PlugConnection} from '@gravity-ui/icons';

import {Button} from '../../../Button';
import {Icon} from '../../../Icon';
import {Flex, spacing} from '../../../layout';
import {ListItemView, useList} from '../../../useList';
import type {ListItemCommonProps, ListItemId} from '../../../useList';
import {createRandomizedData} from '../../../useList/__stories__/utils/makeData';
import {TreeSelect} from '../../TreeSelect';
import type {TreeSelectProps} from '../../types';

/**
 * Just for example how to work with data
 */
interface CustomDataStructure {
    a: string;
}

export interface WithGroupSelectionControlledStateAndCustomIconExampleProps
    extends Omit<
        TreeSelectProps<CustomDataStructure>,
        'value' | 'onUpdate' | 'items' | 'mapItemDataToProps' | 'size'
    > {
    itemsCount?: number;
}

const mapCustomDataStructureToKnownProps = (props: CustomDataStructure): ListItemCommonProps => ({
    title: props.a,
});

export const WithGroupSelectionControlledStateAndCustomIconExample = ({
    itemsCount = 5,
    ...props
}: WithGroupSelectionControlledStateAndCustomIconExampleProps) => {
    const items = React.useMemo(
        () => createRandomizedData({num: itemsCount, getData: (a) => ({a})}),
        [itemsCount],
    );

    const {list, listState} = useList({items});

    const onItemClick = (id: ListItemId) => {
        if (listState.disabledById[id]) return;

        listState.setSelected((prevState) => ({
            ...(props.multiple ? prevState : {}),
            [id]: !prevState[id],
        }));

        listState.setActiveItemId(id);
    };

    return (
        <Flex>
            <TreeSelect
                {...props}
                size="l"
                list={list}
                listState={listState}
                onItemClick={onItemClick}
                mapItemDataToProps={mapCustomDataStructureToKnownProps}
                renderItem={({
                    data,
                    props: {
                        expanded, // don't use default ListItemView expand icon
                        ...state
                    },
                    context: {groupState},
                }) => {
                    return (
                        <ListItemView
                            {...state}
                            {...mapCustomDataStructureToKnownProps(data)}
                            startSlot={
                                <Icon size={16} data={groupState ? Database : PlugConnection} />
                            }
                            endSlot={
                                groupState ? (
                                    <Button
                                        size="m"
                                        className={spacing({mr: 1})}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            listState.setExpanded?.((prevExpandedState) => ({
                                                ...prevExpandedState,
                                                [state.id]: !prevExpandedState[state.id],
                                            }));
                                        }}
                                    >
                                        <Icon data={expanded ? ChevronDown : ChevronUp} size={16} />
                                    </Button>
                                ) : undefined
                            }
                        />
                    );
                }}
            />
        </Flex>
    );
};
