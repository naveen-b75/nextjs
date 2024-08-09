const SUCCESS = undefined;

export const hasLengthAtLeast = (value: string, minimumLength: number) => {
  const message = {
    id: 'validation.hasLengthAtLeast',
    defaultMessage: 'Must contain more characters',
    value: minimumLength
  };
  if (!value || value.length < minimumLength) {
    return message;
  }

  return SUCCESS;
};

export const validateEmail = (value: string) => {
  const FAILURE = 'This is a required field.';
  const emailRegex =
    /^([a-zA-Z0-9^$%*\-'‘’^{}+?!_~/])+(\.([a-zA-Z0-9^$%*‘’\-?!+{}'^_~/])+)*@([a-zA-Z0-9\-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-zA-Z0-9\-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*\.(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]){2,})$/;
  if (emailRegex.test(value)) {
    return SUCCESS;
  } else if (!value) {
    return FAILURE;
  } else {
    const message = 'This is not a valid email address. Please use another email address.';
    return message;
  }
};

export const validateInputField = (value: string): string | undefined => {
  const FAILURE = 'This is a required field.';
  const INVALID = 'Please enter a valid folder name.';
  const fieldRegex = /^[A-Za-z0-9 ]+$/;

  if (!value) {
    return FAILURE;
  } else if (!fieldRegex.test(value)) {
    return INVALID;
  } else {
    return SUCCESS;
  }
};

export const validatePhoneNumber = (value: string) => {
  const FAILURE = 'Please enter a valid phone number.';

  if (value && (value.toString().length < 10 || value.toString().length > 15)) {
    return FAILURE;
  }
  return SUCCESS;
};

export const isRequired = (value?: string | number) => {
  const FAILURE = 'This is a required field.';

  // The field must have a value (no null or undefined) and
  // if it's a boolean, it must be `true`.
  if (!value) return FAILURE;

  // If it is a number or string, it must have at least one character of input (after trim).
  const stringValue = String(value).trim();
  const measureResult = hasLengthAtLeast(stringValue, 1);

  if (measureResult) return FAILURE;
  return SUCCESS;
};

export const adminComment = (value: string) => {
  const FAILURE = 'Comment is empty.';

  // The field must have a value (no null or undefined) and
  // if it's a boolean, it must be `true`.
  if (!value) return FAILURE;

  // If it is a number or string, it must have at least one character of input (after trim).
  const stringValue = String(value).trim();
  const measureResult = hasLengthAtLeast(stringValue, 1);

  if (measureResult) return FAILURE;
  return SUCCESS;
};

export const validatePassword = (value: string) => {
  const count = {
    lower: 0,
    upper: 0,
    digit: 0
  };

  //checking if a value contains any one of these lower, upper, digit
  for (const char of value) {
    if (/[a-z]/.test(char)) count.lower++;
    else if (/[A-Z]/.test(char)) count.upper++;
    else if (/\d/.test(char)) count.digit++;
  }

  //showing error message if count is less then 2
  if (Object.values(count).filter(Boolean).length < 2) {
    const message =
      'A password must contain at least 3 of the following: lowercase, uppercase, digits.';
    return message;
  }

  return SUCCESS;
};

export const validateConfirmPassword = (pass: string, value: string) => {
  let error = '';
  if (pass && value) {
    if (pass !== value) {
      error = 'Password not matching';
    }
  }
  return error;
};
