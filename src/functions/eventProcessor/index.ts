
const serviceBusTrigger: any = async function (context: any, message: any): Promise<void> {
  context.log('Processing Service Bus message:', message);
  context.done();
};

export default serviceBusTrigger;