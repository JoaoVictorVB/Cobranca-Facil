export interface IUseCase<IRequest, IResponse> {
  execute(request: IRequest, ...args: any[]): Promise<IResponse>;
}
