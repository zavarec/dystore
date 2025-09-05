import { RootState } from "@/store";

export const selectSeoMetaList = (state: RootState) => state.seoSlice.items;
export const selectSeoMetaIsLoading = (state: RootState) => state.seoSlice.isLoading;
