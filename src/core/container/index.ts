import { Container } from "inversify";
import { loadSocketContainer } from "../../module/socket/socket.module";
import { loadMessageContainer } from "../../module/Message/message.module";
import { loadConversationContainer } from "../../module/Conversation/conversation.module";

const container = new Container();

loadSocketContainer(container);
loadMessageContainer(container);
loadConversationContainer(container);

export default container;