"use client";  // 🔴 सबसे ऊपर ये लिखना बहुत जरूरी है

import { Provider } from "react-redux";
import store from "./store";

export default function Providers({ children }) {
  return <Provider store={store}>{children}</Provider>;
}