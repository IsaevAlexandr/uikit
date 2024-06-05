import React from 'react';

import {useFocusWithin, useForkRef, useUniqId} from '../../hooks';
import {SelectControl, SelectFilter} from '../Select/components';
import {SelectPopup} from '../Select/components/SelectPopup/SelectPopup';
import {TreeList} from '../TreeList';
import type {TreeListRenderItem} from '../TreeList/types';
import {useMobile} from '../mobile';
import {ListItemView, useList, useListFilter} from '../useList';
import type {ListItemId} from '../useList';
import {block} from '../utils/cn';
import type {CnMods} from '../utils/cn';

import {useTreeSelectSelection, useValue} from './hooks/useTreeSelectSelection';
import type {TreeSelectProps, TreeSelectRenderControlProps} from './types';

import './TreeSelect.scss';

const b = block('tree-select');

const defaultItemRenderer: TreeListRenderItem<unknown> = (renderState) => {
    return <ListItemView {...renderState.props} {...renderState.renderContainerProps} />;
};

export const TreeSelect = React.forwardRef(function TreeSelect<T>(
    {
        id,
        qa,
        title,
        placement,
        slotBeforeListBody,
        slotAfterListBody,
        size = 'm',
        defaultOpen,
        width,
        containerRef: propsContainerRef,
        className,
        containerClassName,
        popupClassName,
        open: propsOpen,
        multiple,
        popupWidth,
        popupDisablePortal,
        onClose,
        onOpenChange,
        onUpdate,
        renderControl,
        renderItem = defaultItemRenderer as TreeListRenderItem<T>,
        renderContainer,
        mapItemDataToProps,
        onFocus,
        onBlur,
        items,
        value: propsValue,
        getItemId,
        defaultValue,
        rootNodesGroups = true,
        defaultGroups = 'expanded',

        filterPlaceholder,
        filterable,
        hasClear = false,
        renderFilter,
        // renderFilter?: (props: {
        //     onChange: (filter: string) => void;
        //     onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
        //     value: string;
        //     ref: React.Ref<HTMLInputElement>;
        //     style: React.CSSProperties;
        // }) => React.ReactElement;
        onFilterChange,
        renderEmptyOptions,
        filterItem,
    }: TreeSelectProps<T>,
    ref: React.Ref<HTMLButtonElement>,
) {
    const mobile = useMobile();
    const uniqId = useUniqId();
    const treeSelectId = id ?? uniqId;

    const controlWrapRef = React.useRef<HTMLDivElement>(null);
    const controlRef = React.useRef<HTMLElement>(null);
    const containerRefLocal = React.useRef<HTMLDivElement>(null);
    const containerRef = propsContainerRef ?? containerRefLocal;

    const handleControlRef = useForkRef(ref, controlRef);

    const {value, setInnerValue, selected} = useValue({
        value: propsValue,
        defaultValue,
    });

    const {list, listState} = useList({
        initialValues: {
            selectedById: selected,
        },
        mixState: {
            selectedById: selected,
        },
        items,
        getItemId,
        defaultGroups,
        // loading,
        rootNodesGroups,
    });

    const wrappedOnUpdate = React.useCallback(
        (ids: ListItemId[]) =>
            onUpdate?.(
                ids,
                ids.map((id) => list.itemsById[id]),
            ),
        [list.itemsById, onUpdate],
    );

    const {open, toggleOpen, handleClearValue, handleMultipleSelection, handleSingleSelection} =
        useTreeSelectSelection({
            setInnerValue,
            value,
            onUpdate: wrappedOnUpdate,
            defaultOpen,
            open: propsOpen,
            onClose,
            onOpenChange,
        });

    const handleItemClick = React.useMemo(() => {
        return (listItemId: ListItemId) => {
            if (listState.disabledById[listItemId]) return;

            // always activate selected item
            listState.setActiveItemId(listItemId);

            const isGroup = listState.expandedById && listItemId in listState.expandedById;

            if (isGroup && listState.setExpanded) {
                listState.setExpanded((prvState) => ({
                    ...prvState,
                    [listItemId]: !prvState[listItemId],
                }));
            } else if (multiple) {
                handleMultipleSelection(listItemId);
            } else {
                handleSingleSelection(listItemId);
            }

            if (!multiple && !isGroup) {
                toggleOpen(false);
            }
        };
    }, [handleMultipleSelection, handleSingleSelection, listState, multiple, toggleOpen]);

    // restoring focus when popup opens
    React.useLayoutEffect(() => {
        if (open) {
            containerRef.current?.focus();
        }

        return () => listState.setActiveItemId(undefined); // reset active item on popup close
        // subscribe only in open event
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const handleClose = React.useCallback(() => toggleOpen(false), [toggleOpen]);

    const {focusWithinProps} = useFocusWithin({
        onFocusWithin: onFocus,
        onBlurWithin: React.useCallback(
            (e: React.FocusEvent) => {
                onBlur?.(e);
                handleClose();
            },
            [handleClose, onBlur],
        ),
    });

    const {filter, filterRef, onFilterUpdate} = useListFilter({
        items,
        filterItem,
        onFilterChange,
    });

    const _renderFilter = () => {
        if (filterable) {
            return (
                // TODO: заменить на честный компонент TextField
                <SelectFilter
                    ref={filterRef}
                    size={size}
                    value={filter}
                    placeholder={filterPlaceholder}
                    onChange={onFilterUpdate}
                    // onKeyDown={handleFilterKeyDown}
                    renderFilter={renderFilter}
                />
            );
        }

        return null;
    };

    const controlProps: TreeSelectRenderControlProps = {
        open,
        toggleOpen,
        clearValue: handleClearValue,
        ref: handleControlRef,
        size,
        value,
        id: treeSelectId,
        activeItemId: listState.activeItemId,
        title,
        hasClear,
    };

    const togglerNode = renderControl ? (
        renderControl(controlProps)
    ) : (
        <SelectControl
            {...controlProps}
            selectedOptionsContent={React.Children.toArray(
                value.map((itemId) => mapItemDataToProps(list.itemsById[itemId]).title),
            ).join(', ')}
            view="normal"
            pin="round-round"
            popupId={`tree-select-popup-${treeSelectId}`}
            selectId={`tree-select-${treeSelectId}`}
        />
    );

    const mods: CnMods = {
        ...(width === 'max' && {width}),
    };

    const inlineStyles: React.CSSProperties = {};

    if (typeof width === 'number') {
        inlineStyles.width = width;
    }

    return (
        <div
            ref={controlWrapRef}
            {...focusWithinProps}
            className={b(mods, className)}
            style={inlineStyles}
        >
            {togglerNode}
            <SelectPopup
                ref={controlWrapRef}
                className={b('popup', {size}, popupClassName)}
                controlRef={controlRef}
                width={popupWidth}
                placement={placement}
                open={open}
                handleClose={handleClose}
                disablePortal={popupDisablePortal}
                mobile={mobile}
                id={`tree-select-popup-${treeSelectId}`}
            >
                {_renderFilter()}

                {slotBeforeListBody}

                {
                    <TreeList<T>
                        size={size}
                        className={b('list', containerClassName)}
                        qa={qa}
                        multiple={multiple}
                        id={`list-${treeSelectId}`}
                        containerRef={containerRef}
                        onItemClick={handleItemClick}
                        list={list}
                        listState={listState}
                        renderContainer={renderContainer}
                        mapItemDataToProps={mapItemDataToProps}
                        renderItem={renderItem ?? defaultItemRenderer}
                    />
                }

                {slotAfterListBody}
            </SelectPopup>
        </div>
    );
}) as <T, P extends {} = {}>(
    props: TreeSelectProps<T, P> & {ref?: React.Ref<HTMLDivElement>},
) => React.ReactElement;
