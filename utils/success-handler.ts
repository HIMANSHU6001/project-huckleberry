export const handleSuccess = <T extends { message: string | null }>(
  data: T
) => {
  return {
    data,
    statusCode: 200,
    status: 'success',
  };
};
