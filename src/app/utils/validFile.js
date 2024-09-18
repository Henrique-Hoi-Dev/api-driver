export const validateAndReturn = (value) => {
  if (
    [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'application/pdf',
      'image/svg+xml',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip',
    ].includes(value)
  ) {
    return value;
  } else {
    throw Error('VALIDATE_ERROR');
  }
};
