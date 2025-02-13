
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

    // Meeting
    MeetingController: Symbol('MeetingController'),
    MeetingGrpcController: Symbol('MeetingGrpcController'),
    MeetingService: Symbol('MeetingService'),
    MeetingRepository: Symbol('MeetingRepository'),

    // external
    ProfileService: Symbol('ProfileService'),
    PaymentService: Symbol('PaymentService'),
    JobService: Symbol('JobService'),

    // socket
    SocketManager: Symbol('SocketManager'),
    SocketService: Symbol('SocketService'),
    SocketController: Symbol('SocketController'),
    MessageSocketController: Symbol('MessageSocketController'),
    RoomSocketController: Symbol('RoomSocketController'),
    TypingSocketController: Symbol('TypingSocketController'),
    MeetingSocketController: Symbol('MeetingSocketController'),

    // kafka
    KafkaProducer: Symbol('KafkaProducer'),
    KafkaConsumer: Symbol('KafkaConsumer'),
    EventController: Symbol('EventController'),
    EventService: Symbol('EventService'),
};
