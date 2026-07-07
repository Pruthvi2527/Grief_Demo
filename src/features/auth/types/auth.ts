export type AuthErrorResult = {
  success: false;
  error: string;
};

export type AuthRedirectResult = {
  success: true;
  redirectTo: string;
};

export type AuthVerificationResult = {
  success: true;
  needsVerification: true;
  email: string;
};

export type AuthSuccessResult = {
  success: true;
  message: string;
};

export type AuthResult =
  | AuthErrorResult
  | AuthRedirectResult
  | AuthVerificationResult
  | AuthSuccessResult;

export type SignUpInput = {
  email: string;
  password: string;
  fullName: string;
};

export type SignInInput = {
  email: string;
  password: string;
};

export type ResetPasswordInput = {
  password: string;
};

export type ForgotPasswordInput = {
  email: string;
};
