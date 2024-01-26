import { useState } from "react";
import OverlayModal from "../Components/OverlayModal";
import { createPortal } from "react-dom";

/**
 * 
 * @param {string} title 
 * @param {string} content 
 * @param {(_closeHandler: () => void) => JSX.Element} renderButtons 
 * @returns {[ReactPortal, ReactDispatch<SetStateAction<boolean>>]}
 */
export const useModal = (title, content, renderButtons) => {
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

  const portal = createPortal(component, document.getElementById("modal"));


  return [portal, setVisible];
}