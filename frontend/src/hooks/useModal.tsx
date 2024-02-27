import { useState } from "react";
import OverlayModal from "../Components/OverlayModal";
import { createPortal } from "react-dom";

export const useModal = (title: string, content: string, renderButtons: (_closeHandler: () => void) => JSX.Element) => {
  const [visible, setVisible] = useState(false);

  const closeHandler = () => {
    setVisible(false);
  }

  const component = <OverlayModal
    title={title}
    content={content}
    visible={visible}
    renderedButtons={renderButtons(closeHandler)}
    onClose={closeHandler}
  />

  const portal = createPortal(component, document.getElementById("modal")!);


  return [portal, setVisible] as const;
}