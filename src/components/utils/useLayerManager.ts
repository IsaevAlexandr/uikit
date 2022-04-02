import React from 'react';
import type {LayerManager} from './LayerManager';
import {LayerContext} from './LayerProvider';

export function useLayerManger(): LayerManager {
    return React.useContext(LayerContext);
}
