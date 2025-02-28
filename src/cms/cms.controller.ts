import { Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { CmsService } from './cms.service';

@Controller('cms')
@UseGuards(JwtAuthGuard, RoleGuard)
export class CmsController {
    constructor(private readonly cmsService: CmsService) {}

    @Patch('/approve-seller/:userId')
    async approveSeller(@Param('userId') userId: string) {
        return this.cmsService.approveSeller(userId);
    }
}
