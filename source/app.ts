import { KinesisClient, PutRecordCommand } from "@aws-sdk/client-kinesis";
import { faker } from '@faker-js/faker';
import moment from 'moment';
// Initialize Kinesis client
const kinesisClient = new KinesisClient({
  region: 'ap-south-1',  // Replace with your AWS region
});

const streamName = 'ServerlessNodeStream';

const generateRandomItem = async () => {
  return({
      user_id: faker.string.uuid(),
      timestamp: moment().unix(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      note_id: faker.string.uuid(),
      email: faker.internet.email(),
      website: faker.internet.url(),
      expires: moment().unix() + 600,
      description: faker.lorem.sentence()
    })
};

setInterval(async() => {
  try{
    let data = await generateRandomItem();
    const dataString = JSON.stringify(data);
    const dataEncoded = Buffer.from(dataString);
    // Prepare the parameters for the PutRecordCommand
    const params = {
      StreamName: streamName,
      Data: dataEncoded,  // The data you're sending to the Kinesis stream
      PartitionKey: 'P1',  // The partition key to group data (e.g., user ID, session ID)
    };
    const command = new PutRecordCommand(params);
    const response = await kinesisClient.send(command);
    console.log('Data sent successfully to Kinesis:', response);
  }catch(err){
    throw err;
  }
}, 1000);
