import * as fromRouter from '@ngrx/router-store';

import { selectRouter } from '../reducers';

//Route selectors
const {
    selectQueryParams,    // select the current route query params
    selectQueryParam,     // factory function to select a query param
    selectRouteParams,    // select the current route params
    selectRouteParam,     // factory function to select a route param
    selectRouteData,      // select the current route data
    selectUrl,            // select the current url
} = fromRouter.getSelectors(selectRouter);

export const selectRouteId = selectRouteParam('id');
export const selectStatus = selectQueryParam('status');