"use client";

import { Provider } from "react-redux";
import { store } from "@/store"; // adjust the path as needed
import React from "react";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
}
