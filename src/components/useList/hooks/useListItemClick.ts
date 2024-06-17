import type {ListItemId, UseList} from '../types';

interface UseListItemClickOptions<T> {
    multiple?: boolean;
    list: UseList<T>;
}

export const useListItemClick = <T = unknown>({list, multiple}: UseListItemClickOptions<T>) => {
    const onItemClick = ({id}: {id: ListItemId}) => {
        if (list.state.disabledById[id]) return;

        // always activate selected item
        list.state.setActiveItemId(id);

        if (list.state.expandedById && id in list.state.expandedById && list.state.setExpanded) {
            list.state.setExpanded((prevState) => ({
                ...prevState,
                [id]: !prevState[id], // expanded by id
            }));
        } else {
            list.state.setSelected((prevState) => ({
                ...(multiple ? prevState : {}),
                [id]: multiple ? !prevState[id] : true, // always select on click in single select variant
            }));
        }
    };

    return onItemClick;
};
