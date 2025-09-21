import { ApiProperty } from "@nestjs/swagger";
import { FileResponseDto } from "./file-response.dto";

export class UploadResponseDto {
  @ApiProperty({ type: [FileResponseDto] })
  files: FileResponseDto[];

  @ApiProperty()
  message: string;
}
