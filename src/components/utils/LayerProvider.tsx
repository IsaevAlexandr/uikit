import React from 'react';
import {LayerManager} from './LayerManager';

export const LayerContext = React.createContext(new LayerManager());

LayerContext.displayName = 'LayerContext';

export type LayerProviderProps = {
    container: React.RefObject<HTMLElement>;
};

export const LayerProvider: React.FC<LayerProviderProps> = ({container, children}) => {
    const context = React.useMemo(() => {
        return new LayerManager(container);
    }, [container]);

    return <LayerContext.Provider value={context}>{children}</LayerContext.Provider>;
};
