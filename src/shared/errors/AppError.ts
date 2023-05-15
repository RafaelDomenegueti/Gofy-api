export class AppError {
  public readonly message: string;
  public readonly statusCode: number;
  public readonly data: object;

  constructor(message: string, statusCode = 400, data: any = null) {
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
  }
}
