import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard("jwt") {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers?.authorization;

    // если заголовка нет, просто пропускаем
    if (!authHeader) {
      return true;
    }

    try {
      const result = await super.canActivate(context);
      return (result as boolean) ?? true;
    } catch (error) {
      // При невалидном токене не выбрасываем 401, просто продолжаем без пользователя
      return true;
    }
  }

  handleRequest(err: unknown, user: any) {
    if (err) {
      return null;
    }
    return user ?? null;
  }
}
