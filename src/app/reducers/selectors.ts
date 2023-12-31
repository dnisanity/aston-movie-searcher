import { Card } from "../../components/CardItem/CardItem";
import { RootState } from "../store";

import { HistoryItem } from "./userSlice";

export const getUserId = (state: RootState): string => state.user.userId;
export const getUserEmail = (state: RootState): string => state.user.email;
export const getUserName = (state: RootState): string => state.user.userName;

export const getHistoryItems = (state: RootState): HistoryItem[] =>
  state.user.historyItems;
export const getFavoriteCardIds = (state: RootState): string[] =>
  state.user.favoriteCardIds;
export const getFavoriteCards = (state: RootState): Card[] =>
  state.user.favoriteCards;
