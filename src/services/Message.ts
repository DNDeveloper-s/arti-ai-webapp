import { ChatGPTMessageObj } from "@/interfaces/IArtiBot";
import { HandleChunkArgs } from "@/components/ArtiBot/ArtiBot";
import { ROUTES } from "@/config/api-config";
import ObjectID from "bson-objectid";
import { ConversationType } from "@/interfaces/IConversation";

export class MessageService {
  async send(
    messages: ChatGPTMessageObj[],
    handleChunk: (a: HandleChunkArgs) => any,
    conversationId?: ObjectID | string,
    conversationType: ConversationType = ConversationType.AD_CREATIVE,
    project_name: string,
    generate_ad?: boolean,
    miniVersion?: boolean,
    showError?: (a: string) => {}
  ) {
    try {
      // const response = await fetch('http://localhost:8080/text-stream', {
      const response = await fetch(
        miniVersion ? ROUTES.MESSAGE.SEND_FREE_TIER : ROUTES.MESSAGE.SEND,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
            Accept: "text/event-stream",
          },
          body: JSON.stringify({
            messages,
            generate_ad,
            conversationId,
            conversationType,
            project_name,
          }),
        }
      );

      if (!response.ok) {
        showError &&
          showError("You message is not sent. Please try again later!");
        return;
      }

      if (!response.body)
        return console.log("Received = No response body present");

      // Check if the response is a json or a stream
      if (response.headers.get("content-type")?.includes("application/json")) {
        const body = await response.json();
        return handleChunk({
          is_ad_json: true,
          json: JSON.stringify(body.data),
          data: body.data,
        });
      }
      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();

      const { value, done } = await reader.read();
      console.log("testing value - ", value, done);

      let i = 0;
      while (true) {
        // console.log('reader - ', await reader.read());
        const { value, done } = await reader.read();
        console.log("testing value - ", value, done);
        handleChunk({ chunk: value, done, index: i });
        i++;
        if (done) break;
      }
      if (response.status === 200) return { ok: true };
      return { ok: false };
      // const response = await axios.post('/api/chat-gpt/send', {messages});
      // return response.data;
      // const response = await axios.post('/api/chat-gpt/send', {messages});
      // return response.data;
    } catch (e) {
      console.log("Error in sending the message - ", e);
    }
  }
}
