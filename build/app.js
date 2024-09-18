"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_kinesis_1 = require("@aws-sdk/client-kinesis");
const faker_1 = require("@faker-js/faker");
const moment_1 = __importDefault(require("moment"));
// Initialize Kinesis client
const kinesisClient = new client_kinesis_1.KinesisClient({
    region: 'ap-south-1', // Replace with your AWS region
});
const streamName = 'ServerlessNodeStream';
const generateRandomItem = () => __awaiter(void 0, void 0, void 0, function* () {
    return ({
        user_id: faker_1.faker.string.uuid(),
        timestamp: (0, moment_1.default)().unix(),
        first_name: faker_1.faker.person.firstName(),
        last_name: faker_1.faker.person.lastName(),
        note_id: faker_1.faker.string.uuid(),
        email: faker_1.faker.internet.email(),
        website: faker_1.faker.internet.url(),
        expires: (0, moment_1.default)().unix() + 600,
        description: faker_1.faker.lorem.sentence()
    });
});
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield generateRandomItem();
        const dataString = JSON.stringify(data);
        const dataEncoded = Buffer.from(dataString);
        // Prepare the parameters for the PutRecordCommand
        const params = {
            StreamName: streamName,
            Data: dataEncoded, // The data you're sending to the Kinesis stream
            PartitionKey: 'P1', // The partition key to group data (e.g., user ID, session ID)
        };
        const command = new client_kinesis_1.PutRecordCommand(params);
        const response = yield kinesisClient.send(command);
        console.log('Data sent successfully to Kinesis:', response);
    }
    catch (err) {
        throw err;
    }
}), 1000);
