export function extractError(error: unknown): string | undefined {
  if (error === null || error === undefined || error === '') {
    return undefined;
  }
  if (typeof error === 'string') {
    return error;
  }

  if (typeof error === 'object') {
    if (error.hasOwnProperty('message')) {
      return (error as { message: string }).message;
    }
  }

  return 'Неизвестная ошибка';
}
