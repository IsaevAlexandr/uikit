import React from 'react';

import {ChevronDown, ChevronUp, FolderOpen} from '@gravity-ui/icons';

import {Button} from '../../../Button';
import {DropdownMenu} from '../../../DropdownMenu';
import {Icon} from '../../../Icon';
import {Flex} from '../../../layout';
import {ListItemView, useList} from '../../../useList';
import {createRandomizedData} from '../../../useList/__stories__/utils/makeData';
import {TreeSelect} from '../../TreeSelect';
import type {TreeSelectProps} from '../../types';

function identity<T>(value: T): T {
    return value;
}
export interface WithItemLinksAndActionsExampleProps
    extends Omit<
        TreeSelectProps<{title: string}>,
        'value' | 'onUpdate' | 'items' | 'mapItemDataToProps' | 'size' | 'open' | 'onOpenChange'
    > {}

export const WithItemLinksAndActionsExample = (props: WithItemLinksAndActionsExampleProps) => {
    const [open, setOpen] = React.useState(true);
    const items = React.useMemo(() => createRandomizedData({num: 10, depth: 1}), []);
    const {list, listState} = useList({
        items,
    });

    return (
        <Flex>
            <TreeSelect
                {...props}
                list={list}
                listState={listState}
                mapItemDataToProps={identity}
                open={open}
                onOpenChange={setOpen}
                size="l"
                renderItem={({
                    data,
                    props: {
                        expanded, // don't use build in expand icon ListItemView behavior
                        ...state
                    },
                    context: {groupState},
                }) => {
                    return (
                        // eslint-disable-next-line jsx-a11y/anchor-is-valid
                        <a
                            href="#"
                            style={{textDecoration: 'none', color: 'inherit', width: '100%'}}
                        >
                            <ListItemView
                                {...data}
                                {...state}
                                endSlot={
                                    <DropdownMenu
                                        onSwitcherClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                        }}
                                        items={[
                                            {
                                                action: (e) => {
                                                    e.stopPropagation();
                                                    console.log(
                                                        `Clicked by action with id: ${state.id}`,
                                                    );
                                                },
                                                text: 'action 1',
                                            },
                                        ]}
                                    />
                                }
                                startSlot={
                                    groupState ? (
                                        <Button
                                            size="m"
                                            view="flat"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();

                                                listState.setExpanded?.((prevExpandedState) => ({
                                                    ...prevExpandedState,
                                                    [state.id]: !prevExpandedState[state.id],
                                                }));
                                            }}
                                        >
                                            <Icon
                                                data={expanded ? ChevronDown : ChevronUp}
                                                size={16}
                                            />
                                        </Button>
                                    ) : (
                                        <Flex
                                            width={28}
                                            justifyContent="center"
                                            spacing={state.indentation > 0 ? {ml: 1} : undefined}
                                        >
                                            <Icon data={FolderOpen} size={16} />
                                        </Flex>
                                    )
                                }
                            />
                        </a>
                    );
                }}
            />
        </Flex>
    );
};
