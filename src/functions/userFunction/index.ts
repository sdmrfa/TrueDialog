import { HttpRequest } from '@azure/functions';

const httpTrigger: any = async function (context: any, req: HttpRequest): Promise<void> {
  context.res = {
    status: 200,
    body: 'User function executed successfully!',
  };
};

export default httpTrigger;