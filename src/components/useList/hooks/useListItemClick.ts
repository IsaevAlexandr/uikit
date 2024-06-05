import type {ListItemId, ListState} from '../types';

interface UseListItemClickOptions {
    multiple?: boolean;
}

export const useListItemClick = (
    listState: ListState,
    {multiple}: UseListItemClickOptions = {},
) => {
    const onItemClick = (id: ListItemId) => {
        if (listState.disabledById[id]) return;

        // always activate selected item
        listState.setActiveItemId(id);

        if (listState.expandedById && id in listState.expandedById && listState.setExpanded) {
            listState.setExpanded((prevState) => ({
                ...prevState,
                [id]: !prevState[id], // exanded by id
            }));
        } else {
            listState.setSelected((prevState) => ({
                ...(multiple ? prevState : {}),
                [id]: !prevState[id],
            }));
        }
    };

    return {
        onItemClick,
    };
};
