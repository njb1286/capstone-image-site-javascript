import { useState } from "react";

export const useModal = () => {
  const [visible, setVisible] = useState(false);

  return [setVisible] as const;
}