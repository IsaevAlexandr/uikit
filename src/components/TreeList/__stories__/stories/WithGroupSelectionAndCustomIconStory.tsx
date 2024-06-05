import React from 'react';

import {ChevronDown, ChevronUp, Database, PlugConnection} from '@gravity-ui/icons';

import {Button} from '../../../Button';
import {Icon} from '../../../Icon';
import {Flex, spacing} from '../../../layout';
import {ListItemView, useList} from '../../../useList';
import type {ListItemCommonProps, ListItemId} from '../../../useList';
import {createRandomizedData} from '../../../useList/__stories__/utils/makeData';
import {TreeList} from '../../TreeList';
import type {TreeListProps} from '../../types';

const expandButtonLabel = 'Expand';
const closeButtonLabel = 'Close';

/**
 * Just for example how to work with data
 */
interface CustomDataStructure {
    a: string;
}

export interface WithGroupSelectionAndCustomIconStoryProps
    extends Omit<
        TreeListProps<CustomDataStructure>,
        'value' | 'onUpdate' | 'items' | 'cantainerRef' | 'size' | 'mapItemDataToProps'
    > {
    itemsCount?: number;
}

const mapCustomDataStructureToKnownProps = (props: CustomDataStructure): ListItemCommonProps => ({
    title: props.a,
});

export const WithGroupSelectionAndCustomIconStory = ({
    itemsCount = 5,
    ...props
}: WithGroupSelectionAndCustomIconStoryProps) => {
    const items = React.useMemo(
        () => createRandomizedData({num: itemsCount, getData: (a) => ({a})}),
        [itemsCount],
    );

    const {list, listState} = useList({
        items,
    });

    const onItemClick = (id: ListItemId) => {
        if (listState.disabledById[id]) return;

        listState.setSelected((prevState) => ({
            ...(props.multiple ? prevState : {}),
            [id]: !prevState[id],
        }));

        listState.setActiveItemId(id);
    };

    return (
        <Flex direction="column" gap="3">
            <TreeList
                {...props}
                size="l"
                mapItemDataToProps={mapCustomDataStructureToKnownProps}
                list={list}
                listState={listState}
                onItemClick={onItemClick}
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
                                        extraProps={{
                                            'aria-label': expanded
                                                ? closeButtonLabel
                                                : expandButtonLabel,
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
