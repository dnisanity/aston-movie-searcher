import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../../utils/firebase";
import transformData from "../../utils/transformData";
import { Card } from "../../components/CardItem/CardItem";
import { RootState } from "../store";
import { API_KEY } from "../../api/cardsApi";

export type HistoryItem = {
  id: string;
  search: string;
  year: string;
  type: string;
  date: string;
};

type UserProps = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

interface UserState {
  userId: string;
  email: string;
  userName: string;
  historyItems: HistoryItem[];
  favoriteCardIds: string[];
  favoriteCards: Card[];
}

const initialState: UserState = {
  userId: "",
  email: "",
  userName: "",
  historyItems: [],
  favoriteCardIds: [],
  favoriteCards: [],
};

export const fetchFavoriteCards = createAsyncThunk<
  Card[],
  void,
  { state: RootState }
>("user/fetchFavoriteCards", async (_arg, { getState }) => {
  const favoriteCardIds = getState().user.favoriteCardIds;
  const cards = [];

  for (const cardId of favoriteCardIds) {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&i=${cardId}`,
    );
    const data = await response.json();
    const result = transformData(data);
    cards.push(result);
  }

  return cards;
});

export const fetchUserDetails = createAsyncThunk(
  "user/fetchUserDetails",
  async (userId: string) => {
    const response = await getDoc(doc(db, "users", userId));
    return response.data();
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLoggedIn(state, { payload: user }: PayloadAction<UserProps>) {
      state.userId = user.uid;
      state.email = user.email || "";
      state.userName = user.displayName || "";
    },
    userLoggedOut(state) {
      state.userId = initialState.userId;
      state.email = initialState.email;
      state.userName = initialState.userName;
      state.historyItems = initialState.historyItems;
      state.favoriteCardIds = initialState.favoriteCardIds;
      state.favoriteCards = initialState.favoriteCards;
    },
    historyAdded(state, action) {
      state.historyItems.push(action.payload);
    },
    historyDeletedByDate(state, action) {
      state.historyItems = state.historyItems.filter(
        (item) => item.date !== action.payload,
      );
    },
    favoriteCardIdAdded(state, { payload: id }: PayloadAction<string>) {
      state.favoriteCardIds.push(id);
    },
    favoriteCardIdDeleted(state, { payload: id }: PayloadAction<string>) {
      state.favoriteCardIds = state.favoriteCardIds.filter(
        (cardId) => cardId !== id,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchUserDetails.fulfilled,
        (state, { payload: userDetails }) => {
          if (userDetails) {
            state.favoriteCardIds = userDetails.favoriteCardIds;
            state.historyItems = userDetails.searchHistory;
          }
        },
      )
      .addCase(
        fetchFavoriteCards.fulfilled,
        (state, { payload: favoriteCards }) => {
          if (favoriteCards) {
            state.favoriteCards = favoriteCards;
          }
        },
      );
  },
});

export const {
  userLoggedIn,
  userLoggedOut,
  historyAdded,
  historyDeletedByDate,
  favoriteCardIdAdded,
  favoriteCardIdDeleted,
} = userSlice.actions;

export default userSlice.reducer;
