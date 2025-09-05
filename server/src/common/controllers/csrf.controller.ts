import { Controller, Get, Req, Res } from "@nestjs/common";

function isSecure(req: any) {
  return (
    req.secure ||
    req.protocol === "https" ||
    req.headers["x-forwarded-proto"] === "https"
  );
}

@Controller("csrf") // с глобальным префиксом это будет /api/csrf
export class CsrfController {
  @Get()
  getCsrf(@Req() req: any, @Res({ passthrough: true }) res: any) {
    const makeToken = (req as any).csrfToken?.bind(req);
    const token = makeToken ? makeToken() : undefined;

    // дублируем токен в JS-доступную cookie
    res.cookie("XSRF-TOKEN", token, {
      httpOnly: false, // важно: фронт должен иметь доступ
      sameSite: "lax",
      secure: isSecure(req), // на http localhost будет false
      path: "/",
      maxAge: 1000 * 60 * 60 * 12, // 12 часов, например
    });

    return { csrfToken: token };
  }
}
