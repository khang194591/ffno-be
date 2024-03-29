import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { CronModule } from './cron/cron.module';
import { EquipmentModule } from './equipments/equipment.module';
import { InvoiceModule } from './invoices/invoice.module';
import { MemberModule } from './members/member.module';
import { PropertyModule } from './properties/property.module';
import { RequestModule } from './requests/request.module';
import { UnitModule } from './units/unit.module';

export const modules = [
  CronModule,
  AuthModule,
  CommonModule,
  MemberModule,
  PropertyModule,
  UnitModule,
  EquipmentModule,
  InvoiceModule,
  RequestModule,
];
