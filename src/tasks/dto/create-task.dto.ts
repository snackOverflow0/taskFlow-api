import { 
  IsString,
  IsOptional
} from "class-validator";
export class CreateTaskDto {
  
  @IsString()
  title!: string
  
  @IsString()
  description!: string

  @IsString()
  @IsOptional()
  priority?: string

  @IsString()
  @IsOptional()
  category?: string
  
}
