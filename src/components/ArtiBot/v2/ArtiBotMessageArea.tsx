import ArtiBotTextArea from "./ArtiBotTextArea";
import MessageContainer from "./MessageContainer";

interface ArtiBotMessageAreaProps {}
export default function ArtiBotMessageArea(props: ArtiBotMessageAreaProps) {
  const enableMessageInput = true;
  function handleSubmitMessage() {}
  return (
    <>
      <MessageContainer />
      <ArtiBotTextArea enableMessageInput={enableMessageInput} />
    </>
  );
}
