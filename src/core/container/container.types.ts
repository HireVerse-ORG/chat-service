
export default {
    // Message
    MessageController: Symbol('MessageController'),
    MessageGrpcController: Symbol('MessageGrpcController'),
    MessageService: Symbol('MessageService'),
    MessageRepository: Symbol('MessageRepository'),

    // Message
    ConversationController: Symbol('ConversationController'),
    ConversationGrpcController: Symbol('ConversationGrpcController'),
    ConversationService: Symbol('ConversationService'),
    ConversationRepository: Symbol('ConversationRepository'),

    // socket
    SocketManager: Symbol('SocketManager'),
    SocketService: Symbol('SocketService'),
    SocketController: Symbol('SocketController'),

    // kafka
    KafkaProducer: Symbol('KafkaProducer'),
    KafkaConsumer: Symbol('KafkaConsumer'),
    EventController: Symbol('EventController'),
    EventService: Symbol('EventService'),
};
