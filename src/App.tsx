import React from "react";

import { BrowserRouter } from "react-router-dom";

import { LoadingOverlay } from "@mantine/core";

import Header from "./components/Header/Header";
import useAuthLoadingState from "./hooks/useAuthLoadingState";
import PageLayout from "./components/PageLayout/PageLayout";
import Router from "./app/routing/Router";

const App = () => {
  const authStateIsLoading = useAuthLoadingState();

  if (authStateIsLoading) {
    return <LoadingOverlay visible={true} overlayBlur={2} />;
  }

  return (
    <BrowserRouter>
      <Header />
      <PageLayout>
        <Router />
      </PageLayout>
    </BrowserRouter>
  );
};

export default App;
