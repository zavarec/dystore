import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { LayoutService } from "./layout.service";

@ApiTags("Layout Public")
@Controller("layout")
export class LayoutPublicController {
  constructor(private readonly layoutService: LayoutService) {}

  @Get("home")
  getHome() {
    return this.layoutService.getHomeLayout();
  }
}
