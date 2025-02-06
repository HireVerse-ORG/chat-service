import { Container } from "inversify";
import { loadSocketContainer } from "../../module/socket/socket.module";
import { loadMessageContainer } from "../../module/Message/message.module";
import { loadConversationContainer } from "../../module/Conversation/conversation.module";
import { loadExternalContainer } from "../../module/external/external.module";

const container = new Container();

loadExternalContainer(container);
loadSocketContainer(container);
loadMessageContainer(container);
loadConversationContainer(container);

export default container;