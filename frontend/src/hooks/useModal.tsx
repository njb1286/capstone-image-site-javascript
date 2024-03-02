import { useState } from "react";
import OverlayModal from "../Components/OverlayModal";
import { createPortal } from "react-dom";

/**
 * 
 * @param title - The title of the modal
 * @param content - The text content of the modal
 * @param renderButtons - A callback function that returns the buttons to render in the modal, taking into account the close handler as an argument
 * @returns A tuple with the following properties:
 * - The first element is the component to render
 * - The second element is a function that sets the visibility of the modal
 */
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