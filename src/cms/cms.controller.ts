import { Controller, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { CmsService } from './cms.service';
import { Roles } from 'src/auth/decorator/role.decorator';
import User, { UserRole } from 'src/user/entity/user.entity';

@Controller('cms')
@UseGuards(JwtAuthGuard, RoleGuard)
export class CmsController {
    constructor(private readonly cmsService: CmsService) {}

    @Patch('/approve-seller/:userId')
    @Roles(UserRole.ADMIN)
    async approveSeller(@Req() req: { user: User }, @Param('userId') userId: string) {
        const admin: User = req.user;
        return this.cmsService.approveSeller(userId, admin);
    }

    @Patch('/reject-seller/:userId')
    @Roles(UserRole.ADMIN)
    async rejectSeller(@Req() req: { user: User }, @Param('userId') userId: string) {
        const admin: User = req.user;
        return this.cmsService.rejectSeller(userId, admin);
    }
}
