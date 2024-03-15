import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { EquipmentModule } from './equipments/equipment.module';
import { MemberModule } from './members/member.module';
import { PropertyModule } from './properties/property.module';
import { UnitModule } from './units/unit.module';

export const modules = [
  AuthModule,
  CommonModule,
  MemberModule,
  PropertyModule,
  UnitModule,
  EquipmentModule,
];
