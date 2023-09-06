import { useCallback } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
} from "firebase/auth";
import { useDispatch } from "react-redux";

import { useNavigate } from "react-router";

import { notifications } from "@mantine/notifications";

import { doc, setDoc } from "@firebase/firestore";

import { Action, ThunkDispatch } from "@reduxjs/toolkit";

import {
  fetchUserDetails,
  userLoggedIn,
  userLoggedOut,
} from "../app/reducers/userSlice";
import { db } from "../utils/firebase";
import { RootState } from "../app/store";

interface Props {
  email: string;
  password: string;
}

const useAuth = () => {
  const auth = getAuth();
  const dispatch = useDispatch();
  const thunkDispatch = useDispatch<ThunkDispatch<RootState, string, Action>>();
  const navigate = useNavigate();

  const signUp = useCallback(
    async ({ email, password }: Props) => {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const { uid, email } = userCredential.user;
          dispatch(userLoggedIn({ uid, email }));
          setDoc(doc(db, "users", uid), {
            searchHistory: [],
            favoriteCardIds: [],
          });
          navigate("/");
        })
        .catch((error) => {
          notifications.show({
            title: "Error",
            color: "pink",
            message: error.message + " 🤥",
          });
        });
    },
    [auth, dispatch, navigate],
  );

  const login = useCallback(
    async ({ email, password }: Props) => {
      await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const { uid, email } = userCredential.user;
          dispatch(userLoggedIn({ uid, email }));
          thunkDispatch(fetchUserDetails(uid));
          navigate("/");
        })
        .catch((error) => {
          notifications.show({
            title: "Error",
            color: "pink",
            message: error.message + " 🤥",
          });
        });
    },
    [auth, dispatch, navigate],
  );

  const loginWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider).then((result) => {
      const details = getAdditionalUserInfo(result);
      const isNewUser = details?.isNewUser;
      const { uid, email } = result.user;
      dispatch(userLoggedIn({ uid, email }));
      if (isNewUser) {
        setDoc(doc(db, "users", uid), {
          searchHistory: [],
          favoriteCardIds: [],
        });
      } else {
        thunkDispatch(fetchUserDetails(uid));
      }
      navigate("/");
    });
  }, [auth, dispatch, navigate]);

  const logout = useCallback(() => {
    signOut(auth);
    dispatch(userLoggedOut());
  }, [auth, dispatch]);

  return { signUp, login, loginWithGoogle, logout };
};

export default useAuth;
