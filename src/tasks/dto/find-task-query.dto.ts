import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export type IFilterDate =
  | 'all_time'
  | 'today'
  | 'this_week'
  | 'this_month'
  | 'this_year';

export class FindTaskQueryDto {
  @ApiPropertyOptional({
    enum: ['all_time', 'today', 'this_week', 'this_month', 'this_year'],
    default: 'all_time',
    description: 'Filter tasks by date range',
  })
  @IsOptional()
  @IsIn(['all_time', 'today', 'this_week', 'this_month', 'this_year'])
  filterDate?: IFilterDate;
}
