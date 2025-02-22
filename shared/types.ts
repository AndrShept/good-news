export type SuccessResponse<T = undefined> = {
  success: true;
  message: string;
  data?: T;
};
export type ErrorResponse = {
    success : boolean;
    error: string
    isFormError? : boolean
}
