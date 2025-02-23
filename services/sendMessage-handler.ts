// executeOrder/handler.ts
export const handler = async (event: {
  Records: {
    Sns: {
      Message: string;
    };
  }[];
}): Promise<void> => {
  event.Records.forEach(({ Sns: { Message } }) => {
    const body = JSON.parse(Message);

    return { statusCode: 201, body: String(body?.name) };
  });
};
