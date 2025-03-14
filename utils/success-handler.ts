export const handleSuccess = <
  T extends {
    profile_photo: string;
    message: string | null;
  },
>(
  data: T
) => {
  return {
    data,
    statusCode: 200,
    status: 'success',
  };
};
