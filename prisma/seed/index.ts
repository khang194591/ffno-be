import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { randomInt } from 'crypto';
import dayjs from 'dayjs';
import {
  ContactType,
  MemberRole,
  PropertyType,
  UnitStatus,
} from '../../src/libs';
import {
  equipmentCategories,
  fakeContract,
  fakeMember,
  fakeProperty,
  fakeUnit,
  getRandomItemInArray,
  propertyAmenities,
  unitFeatures,
} from './helper';
import { writeFileSync } from 'fs';

const prisma = new PrismaClient();

const seed = async () => {
  await prisma.$transaction([
    prisma.notification.deleteMany(),
    prisma.review.deleteMany(),
    prisma.contract.deleteMany(),
    prisma.memberReceiveRequest.deleteMany(),
    prisma.request.deleteMany(),
    prisma.invoiceItem.deleteMany(),
    prisma.invoice.deleteMany(),
    prisma.unitPriceLog.deleteMany(),
    prisma.unitFeature.deleteMany(),
    prisma.unit.deleteMany(),
    prisma.equipmentCategory.deleteMany(),
    prisma.equipment.deleteMany(),
    prisma.propertyAmenity.deleteMany(),
    prisma.property.deleteMany(),
    prisma.memberContacts.deleteMany(),
    prisma.member.deleteMany(),
  ]);

  await prisma.member.create({
    data: fakeMember({
      id: 'eeb06826-843f-4f4f-a298-b1ce3b9a370b',
      email: 'admin@gmail.com',
      password: hashSync('123456', 10),
      role: MemberRole.ADMIN,
      name: 'Admin',
      imgUrl: 'https://avatar.iran.liara.run/public/02',
    }),
  });

  const landlordIds = [
    '2c4378f7-a216-4a31-a891-e1be254ba970',
    '9bc9db59-bcb9-4fcb-91fa-031e8fd2c4f5',
    '411abc4a-4ea1-4b7d-9df3-9f598ada5e62',
  ];

  const landlords = [
    fakeMember({
      id: landlordIds[0],
      email: 'landlord_01@gmail.com',
      password: hashSync('123456', 10),
      role: MemberRole.LANDLORD,
      name: 'Landlord 01',
      imgUrl: 'https://avatar.iran.liara.run/public/03',
    }),
    fakeMember({
      id: landlordIds[1],
      email: 'landlord_02@gmail.com',
      password: hashSync('123456', 10),
      role: MemberRole.LANDLORD,
      name: 'Landlord 02',
      imgUrl: 'https://avatar.iran.liara.run/public/04',
    }),
    fakeMember({
      id: landlordIds[2],
      email: 'landlord_03@gmail.com',
      password: hashSync('123456', 10),
      role: MemberRole.LANDLORD,
      name: 'Landlord 03',
      imgUrl: 'https://avatar.iran.liara.run/public/05',
    }),
  ];

  const tenants = Array.from({ length: randomInt(10) }).map(() => fakeMember());

  const propertyIds = [
    '4d5f4d8c-0c89-40a5-91d4-675cb9e7c9f1',
    '2f7c529a-b7c7-42ad-bbbc-2cb1dc8395f1',
    '1d3b4f3b-3b21-4d7a-a6e7-36c2b2a9db0f',
    'f78d5d39-0173-4de5-baa7-712b8f2b82a7',
    '2e9b4c9b-0b21-47d9-b4a7-2b1c3f9f5b6e',
    'a3f5e7c5-5b3d-4c9a-a5f1-6d2b9c8f7b3d',
    '4c5b2d8c-3e7a-4d8a-9b5f-2d8c5b7a1e7a',
    '7d8a5b9c-4f5e-49b8-9c7a-1b2c8f6a7d3b',
    '5b3e9a8c-2d7f-4d8b-9a5c-3e7d5a8b1c4a',
    '8f7c5b3a-1d6e-4b9a-7d5c-4e3b2a1c9d7e',
  ];

  const unitIds = [
    '1e24c1ff-8148-4a8a-9a65-87f0b28182a4',
    '7e1c251e-3c9f-4d12-b8e9-6561a23e5b07',
    '08c226d8-0c67-4a5c-9829-bb5ff065e3e7',
    '54f5cf7a-d1a2-4b7c-9d9f-8e8471c3e8e4',
    'c8b2c4b1-74e5-4e1e-9d74-d85e6346bcbf',
    'fae14b2e-6f27-4c29-9d67-fb4f232e3b9f',
    'fd4c7f8c-5a8b-4a8e-8e2b-bd7f1a0b6f3a',
    '2d8a5b1f-4d7e-4a9e-8c2f-1a8b4f6e7c3d',
    '7c1f8d9e-2b3a-4f8c-9e7a-5b2c4a8e3f1d',
    '8e5b7c3a-1f4e-4a9e-9c7d-6b3a2d8c1f5e',
    '9f8b6c5d-2e3a-4f9a-8c1b-7a3e5b2c4f6d',
    'a3b2d7c4-5e6a-4b9f-8d2c-1f4a3e7c9b5d',
    'b4c1d8a5-6e7a-4b8c-9f1d-2e3a4d5b7f6c',
    'd8e7c4b3-1f6a-4a9b-8c5e-2b3a5d7f1c4d',
    'f6b7d8a3-2e9c-4b1f-8d3e-7a5c4f2a6b1e',
  ];

  const properties = [
    fakeProperty(landlordIds[0], {
      id: propertyIds[0],
      province: 'Thành phố Hà Nội',
      district: 'Quận Ba Đình',
      ward: 'Phường Ngọc Hà',
      type: PropertyType.SINGLE_UNIT,
      name: 'Ngõ 151 Hoàng Hoa Thám',
      address: 'Ngõ 151 Hoàng Hoa Thám',
      imgUrls: [
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/4.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/5.jpg',
      ],
      description: `Ngõ 151 Hoàng Hoa Thám, trống 1 phòng Ở LUÔN
      Full điều hoà, nóng lạnh, giường tủ quần áo
      Cổng khoá vân tay, thoải mái giờ giấc, đảm bảo pccc
      Giá chỉ: 2tr5 vệ sinh chung cùng tầng
      Lh: 0353.935.788
      `,
    }),
    fakeProperty(landlordIds[0], {
      id: propertyIds[1],
      province: 'Thành phố Hà Nội',
      district: 'Quận Thanh Xuân',
      ward: 'Phường Thanh Xuân Nam',
      type: PropertyType.MULTIPLE_UNIT,
      name: 'Phòng trọ sinh viên',
      address: 'Ngõ 68/45 Triều Khúc',
      imgUrls: [
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/100.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/101.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/102.jpg',
      ],
      description: `Cho Thuê Phòng Trọ Sinh Viên
      🏠 Địa chỉ : Ngõ 68/45 Triều Khúc
      Giá cực tốt  :  3tr3
      ✨Phòng 25m2 Không chung chủ , giờ giấc tự do. Có ban công siêu thoáng
      ✨Thang máy , chỗ để xe siêu rộng , camera an ninh , máy giặt chung
      Hệ thống pccc đạt chuẩn
      ❣Nội thất : Full đồ như ảnh, điều hòa, nóng lạnh, Wc khép kín ,giường, tủ quần áo
      Điện 4k nước 100k 
      Liên hệ chủ nhà   0385785252 có zalo (không môi giới)
      `,
    }),
    fakeProperty(landlordIds[0], {
      id: propertyIds[2],
      province: 'Thành phố Hà Nội',
      district: 'Quận Thanh Xuân',
      ward: 'Phường Khương Đình',
      type: PropertyType.SINGLE_UNIT,
      name: 'Khương đình hạ đình nguyễn trãi Thanh xuân',
      address: 'ngõ 236/28 khương đình',
      imgUrls: [
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/103.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/104.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/105.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/106.jpg',
      ],
      description: `-KHƯƠNG ĐINH__Hạ ĐINH_ Nguyễn trãi_ THANH XUÂN
      -ĐC ngõ 236/28 khương đình
      -Phòng có DT ,22m2
      -Điều hòa, nóng lạnh,. kệ bếp tủ bếp. t Giường tủ>quat trần
      -Giá  -3x
      => LH:    0982670385   Zalo a hu`,
    }),
    fakeProperty(landlordIds[1], {
      id: propertyIds[3],
      province: 'Thành phố Hà Nội',
      district: 'Quận Ba Đình',
      ward: 'Phường Liễu Giai',
      type: PropertyType.SINGLE_UNIT,
      name: '2N1K ngõ 285 ĐỘI CẤN',
      address: '2N1K ngõ 285 ĐỘI CẤN',
      imgUrls: [
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/200.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/201.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/202.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/203.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/204.jpg',
      ],
      description: `✔️Cho thuê 2N1K ngõ 285 ĐỘI CẤN
➖ Diện tích/ Thiết kế: 60/2n1k
➖Nội thất : full đồ
➖Giá : 8tr/tháng
𝑳𝒊𝒆̂𝒏 𝒉𝒆̣̂: 0365008686`,
    }),
    fakeProperty(landlordIds[1], {
      id: propertyIds[4],
      province: 'Thành phố Hà Nội',
      district: 'Quận Hai Bà Trưng',
      ward: 'Phường Minh Khai',
      type: PropertyType.MULTIPLE_UNIT,
      name: '15/10 Gốc Đề Minh Khai',
      address: '15/10 Gốc Đề Minh Khai',
      imgUrls: [
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/300.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/301.jpg',
      ],
      description: `Nhà 6 tầng còn phòng ở luôn tại 15/10 Gốc Đề Minh Khai 
      👉phòng nhỏ 1,1tr- 1,5tr vệ sinh khép kín 
      👉phòng 2tr- 2,7tr -3,5tr -4,3tr  vệ sinh khép kín, nóng lạnh, điều hoà, giường tủ , kệ bếp , cửa sổ 
      điện: 3,5k/so 
      nước: 25k/so 
      lh: 0949454083 - 0968112640 Bác Toàn
      `,
    }),
    fakeProperty(landlordIds[2], {
      id: propertyIds[5],
      province: 'Thành phố Hà Nội',
      district: 'Quận Hoàng Mai',
      ward: 'Phường Thanh Trì',
      type: PropertyType.SINGLE_UNIT,
      name: 'ngõ 279 Hoàng Mai',
      address: 'ngõ 279 Hoàng Mai',
      imgUrls: [
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/501.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/502.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/503.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/504.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/505.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/506.jpg',
      ],
      description: `🎯M có  phòng cho thuê ở ngõ 279 Hoàng Mai giá 3tr 
      +Điện 4k/ số, nước 35k/ khối, wifi+ vệ sinh: 150k/1p
      +Đầy đủ đh nl, máy giặt chung, giường tủ, vskk, chỉ việc đến ở . 
      + Giờ giấc tự do .Vào luôn được luôn. 
      + Gần time city, Hust, neu, hunt, uneti
      Ib để biết rõ tt hơn.
      Liên hệ c Dung 0936085718.`,
    }),
    fakeProperty(landlordIds[2], {
      id: propertyIds[6],
      province: 'Thành phố Hà Nội',
      district: 'Quận Cầu Giấy',
      ward: 'Phường Nghĩa Đô',
      type: PropertyType.SINGLE_UNIT,
      name: 'Ngõ 71 Võ Chí Công -Cầu Giấy',
      address: 'Ngõ 71 Võ Chí Công -Cầu Giấy',
      imgUrls: [
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/601.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/602.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/603.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/604.jpg',
      ],
      description: `Ngõ 71 Võ Chí Công -Cầu Giấy
      Studio khép kín - full đồ - #4tr
      K chung chủ - ở luôn 
      Call/zalo:0349213298❤️
      `,
    }),
    fakeProperty(landlordIds[2], {
      id: propertyIds[7],
      province: 'Thành phố Hà Nội',
      district: 'Quận Hai Bà Trưng',
      ward: 'Phường Đồng Tâm',
      type: PropertyType.SINGLE_UNIT,
      name: '128C Đại La,',
      address: '128C Đại La,',
      imgUrls: [
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/700.jpg',
      ],
      description: `Cho thuê nhà tập thể 128C Đại La, tầng 2
      Dt 60m, 1 phòng khách, 2 phòng ngủ, 1 phòng tắm, 1 bếp, có điều hòa, nóng lạnh, tủ giường, giờ giấc tự do không chung chủ, cho ở nhóm sinh viên, hộ gia đình. Gần đại học Bách Khoa, Kinh Tế, Xây Dựng....
      Giá 5,5 triệu/tháng. Đóng 3 tháng, cọc 1 tháng.
      Liên hệ 0932491982 ( Ko tiếp môi giới)
      `,
    }),
    fakeProperty(landlordIds[2], {
      id: propertyIds[8],
      province: 'Thành phố Hà Nội',
      district: 'Quận Hai Bà Trưng',
      ward: 'Phường Đồng Tâm',
      type: PropertyType.SINGLE_UNIT,
      name: 'CCMN Hà Nội',
      address: 'ngõ 51 tương mai',
      imgUrls: [
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/801.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/802.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/803.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/804.jpg',
      ],
      description: `Cho Thuê Ccmn hà nội 
      Địa chỉ ngõ 51 tương mai gần neu
      👉Phòng đầy đủ nội thất như hình 
      👉Tài chính 3tr8
      🍀Xem phòng freee 
      🌟Ib ngay cho e để biết thêm tt ạ 
       ☎️ Liên hệ :  Za.lo 0971537189
      `,
    }),
    fakeProperty(landlordIds[2], {
      id: propertyIds[9],
      province: 'Thành phố Hà Nội',
      district: 'Quận Hai Bà Trưng',
      ward: 'Phường Minh Khai',
      type: PropertyType.SINGLE_UNIT,
      name: 'Minh Khai, Quận Hai Bà Trưng, Hà Nội',
      address: 'Phường Minh Khai, Quận Hai Bà Trưng, Hà Nội',
      imgUrls: [
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/901.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/902.jpg',
      ],
      description: `CÒN 1 PHÒNG DUY NHẤT CHO NỮ THUÊ - PHƯỜNG MINH KHAI, QUẬN HAI BÀ TRƯNG, HÀ NỘI
      - Địa chỉ: Phường Minh Khai, Quận Hai Bà Trưng, Hà Nội
      - Diện tích: 20m2
      - Có chỗ nấu ăn, có thang thoát hiểm, có ban công thoáng mát.
      - Phòng có đủ đồ như hình.
      - phòng có vị trí đẹp. Nhà xây mới đét. Nhà cách phố 50m.
      - Khu ở dân cư đông, an ninh tốt, hàng xóm thân thiện dễ gần, văn minh lịch sự.
      - Xung quanh đầy đủ các tiện ích khác nhau: gần trường Bách Kinh Xây, Công Nghệ, gần chợ, siêu thị, trung tâm,...
      - Rất phù hợp để an cư sinh sống (cho nữ thuê) chỉ việc xách valy vào ở.
      + Giá Thuê: 4tr/tháng
      => Liên Hệ Xem Phòng: 0973258928 (cô Hồng Thanh)`,
    }),
  ];

  writeFileSync(
    'prisma/seed/data/properties.json',
    JSON.stringify(properties, null, 2),
  );

  const units = [
    fakeUnit(propertyIds[0], {
      id: unitIds[0],
      name: 'Ngõ 151 Hoàng Hoa Thám',
      area: 25,
      price: 2_500_000,
      deposit: 2_500_000,
      imgUrls: [
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/4.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/5.jpg',
      ],
      description: `Ngõ 151 Hoàng Hoa Thám, trống 1 phòng Ở LUÔN
      Full điều hoà, nóng lạnh, giường tủ quần áo
      Cổng khoá vân tay, thoải mái giờ giấc, đảm bảo pccc
      Giá chỉ: 2tr5 vệ sinh chung cùng tầng
      Lh: 0353.935.788
      `,
      status: UnitStatus.GOOD,
    }),
    fakeUnit(propertyIds[1], {
      id: unitIds[1],
      name: 'Phòng 402',
      area: 25,
      price: 3_330_000,
      deposit: 3_330_000,
      description: `Cho Thuê Phòng Trọ Sinh Viên
      🏠 Địa chỉ : Ngõ 68/45 Triều Khúc
      Giá cực tốt  :  3tr3
      ✨Phòng 25m2 Không chung chủ , giờ giấc tự do. Có ban công siêu thoáng
      ✨Thang máy , chỗ để xe siêu rộng , camera an ninh , máy giặt chung
      Hệ thống pccc đạt chuẩn
      ❣Nội thất : Full đồ như ảnh, điều hòa, nóng lạnh, Wc khép kín ,giường, tủ quần áo
      Điện 4k nước 100k 
      Liên hệ chủ nhà   0385785252 có zalo (không môi giới)
      `,
      status: UnitStatus.GOOD,
      imgUrls: [
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/100.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/101.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/102.jpg',
      ],
    }),
    fakeUnit(propertyIds[1], {
      id: unitIds[2],
      name: 'Phòng 401',
      area: 25,
      price: 3_330_000,
      deposit: 3_330_000,
      description: `Cho Thuê Phòng Trọ Sinh Viên
      🏠 Địa chỉ : Ngõ 68/45 Triều Khúc
      Giá cực tốt  :  3tr3
      ✨Phòng 25m2 Không chung chủ , giờ giấc tự do. Có ban công siêu thoáng
      ✨Thang máy , chỗ để xe siêu rộng , camera an ninh , máy giặt chung
      Hệ thống pccc đạt chuẩn
      ❣Nội thất : Full đồ như ảnh, điều hòa, nóng lạnh, Wc khép kín ,giường, tủ quần áo
      Điện 4k nước 100k 
      Liên hệ chủ nhà   0385785252 có zalo (không môi giới)
      `,
      status: UnitStatus.GOOD,
      imgUrls: [
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/100.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/101.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/102.jpg',
      ],
    }),
    fakeUnit(propertyIds[2], {
      id: unitIds[3],
      name: 'Phòng 101',
      area: 22,
      price: 3_100_000,
      deposit: 3_100_000,
      status: UnitStatus.GOOD,
      imgUrls: [
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/103.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/104.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/105.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/106.jpg',
      ],
      description: `-KHƯƠNG ĐINH__Hạ ĐINH_ Nguyễn trãi_ THANH XUÂN
      -ĐC ngõ 236/28 khương đình
      -Phòng có DT ,22m2
      -Điều hòa, nóng lạnh,. kệ bếp tủ bếp. t Giường tủ>quat trần
      -Giá  -3x
      => LH:    0982670385   Zalo a hu`,
    }),
    fakeUnit(propertyIds[2], {
      id: unitIds[4],
      name: 'Phòng 102',
      area: 22,
      price: 3_100_000,
      deposit: 3_100_000,
      status: UnitStatus.GOOD,
      imgUrls: [
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/103.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/104.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/105.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/106.jpg',
      ],
      description: `-KHƯƠNG ĐINH__Hạ ĐINH_ Nguyễn trãi_ THANH XUÂN
      -ĐC ngõ 236/28 khương đình
      -Phòng có DT ,22m2
      -Điều hòa, nóng lạnh,. kệ bếp tủ bếp. t Giường tủ>quat trần
      -Giá  -3x
      => LH:    0982670385   Zalo a hu`,
    }),
    fakeUnit(propertyIds[3], {
      id: unitIds[5],
      name: '2N1K ngõ 285 ĐỘI CẤN',
      area: 60,
      price: 8_000_000,
      deposit: 8_000_000,
      status: UnitStatus.GOOD,
      imgUrls: [
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/200.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/201.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/202.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/203.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/204.jpg',
      ],
      description: `✔️Cho thuê 2N1K ngõ 285 ĐỘI CẤN
➖ Diện tích/ Thiết kế: 60/2n1k
➖Nội thất : full đồ
➖Giá : 8tr/tháng
𝑳𝒊𝒆̂𝒏 𝒉𝒆̣̂: 0365008686`,
    }),
    fakeUnit(propertyIds[4], {
      id: unitIds[6],
      name: 'Phòng 601',
      area: 15,
      price: 1_500_000,
      deposit: 1_500_000,
      status: UnitStatus.GOOD,
      imgUrls: [
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/300.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/301.jpg',
      ],
      description: `Nhà 6 tầng còn phòng ở luôn tại 15/10 Gốc Đề Minh Khai 
      👉phòng nhỏ 1,1tr- 1,5tr vệ sinh khép kín 
      👉phòng 2tr- 2,7tr -3,5tr -4,3tr  vệ sinh khép kín, nóng lạnh, điều hoà, giường tủ , kệ bếp , cửa sổ 
      điện: 3,5k/so 
      nước: 25k/so 
      lh: 0949454083 - 0968112640 Bác Toàn
      `,
    }),
    fakeUnit(propertyIds[4], {
      id: unitIds[7],
      name: 'Phòng 501',
      area: 25,
      price: 2_500_000,
      deposit: 2_500_000,
      status: UnitStatus.GOOD,
      imgUrls: [
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/300.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/301.jpg',
      ],
      description: `Nhà 6 tầng còn phòng ở luôn tại 15/10 Gốc Đề Minh Khai 
      👉phòng nhỏ 1,1tr- 1,5tr vệ sinh khép kín 
      👉phòng 2tr- 2,7tr -3,5tr -4,3tr  vệ sinh khép kín, nóng lạnh, điều hoà, giường tủ , kệ bếp , cửa sổ 
      điện: 3,5k/so 
      nước: 25k/so 
      lh: 0949454083 - 0968112640 Bác Toàn
      `,
    }),
    fakeUnit(propertyIds[5], {
      id: unitIds[8],
      name: 'ngõ 279 Hoàng Mai',
      area: 25,
      price: 3_000_000,
      deposit: 3_000_000,
      status: UnitStatus.GOOD,
      imgUrls: [
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/501.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/502.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/503.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/504.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/505.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/506.jpg',
      ],
      description: `🎯M có  phòng cho thuê ở ngõ 279 Hoàng Mai giá 3tr 
      +Điện 4k/ số, nước 35k/ khối, wifi+ vệ sinh: 150k/1p
      +Đầy đủ đh nl, máy giặt chung, giường tủ, vskk, chỉ việc đến ở . 
      + Giờ giấc tự do .Vào luôn được luôn. 
      + Gần time city, Hust, neu, hunt, uneti
      Ib để biết rõ tt hơn.
      Liên hệ c Dung 0936085718.`,
    }),
    fakeUnit(propertyIds[6], {
      id: unitIds[9],
      name: 'Ngõ 71 Võ Chí Công -Cầu Giấy',
      area: 30,
      price: 4_000_000,
      deposit: 4_000_000,
      status: UnitStatus.GOOD,
      imgUrls: [
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/601.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/602.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/603.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/604.jpg',
      ],
      description: `Ngõ 71 Võ Chí Công -Cầu Giấy
      Studio khép kín - full đồ - #4tr
      K chung chủ - ở luôn 
      Call/zalo:0349213298❤️
      `,
    }),
    fakeUnit(propertyIds[7], {
      id: unitIds[10],
      name: '128C Đại La',
      area: 60,
      price: 5_500_000,
      deposit: 5_500_000,
      status: UnitStatus.GOOD,
      imgUrls: [
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/700.jpg',
      ],
      description: `Cho thuê nhà tập thể 128C Đại La, tầng 2
      Dt 60m, 1 phòng khách, 2 phòng ngủ, 1 phòng tắm, 1 bếp, có điều hòa, nóng lạnh, tủ giường, giờ giấc tự do không chung chủ, cho ở nhóm sinh viên, hộ gia đình. Gần đại học Bách Khoa, Kinh Tế, Xây Dựng....
      Giá 5,5 triệu/tháng. Đóng 3 tháng, cọc 1 tháng.
      Liên hệ 0932491982 ( Ko tiếp môi giới)
      `,
    }),
    fakeUnit(propertyIds[8], {
      id: unitIds[11],
      name: 'Tầng 2',
      area: 30,
      price: 3_800_000,
      deposit: 0,
      status: UnitStatus.GOOD,
      imgUrls: [
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/801.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/802.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/803.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/804.jpg',
      ],
      description: `Cho Thuê Ccmn hà nội 
      Địa chỉ ngõ 51 tương mai gần neu
      👉Phòng đầy đủ nội thất như hình 
      👉Tài chính 3tr8
      🍀Xem phòng freee 
      🌟Ib ngay cho e để biết thêm tt ạ 
       ☎️ Liên hệ :  Za.lo 0971537189
      `,
    }),
    fakeUnit(propertyIds[8], {
      id: unitIds[12],
      name: 'Tầng 3',
      area: 30,
      price: 3_800_000,
      deposit: 0,
      status: UnitStatus.GOOD,
      imgUrls: [
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/801.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/802.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/803.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/804.jpg',
      ],
      description: `Cho Thuê Ccmn hà nội 
      Địa chỉ ngõ 51 tương mai gần neu
      👉Phòng đầy đủ nội thất như hình 
      👉Tài chính 3tr8
      🍀Xem phòng freee 
      🌟Ib ngay cho e để biết thêm tt ạ 
       ☎️ Liên hệ :  Za.lo 0971537189
      `,
    }),
    fakeUnit(propertyIds[8], {
      id: unitIds[13],
      name: 'Tầng 4',
      area: 30,
      price: 3_800_000,
      deposit: 0,
      status: UnitStatus.GOOD,
      imgUrls: [
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/801.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/802.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/803.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/804.jpg',
      ],
      description: `Cho Thuê Ccmn hà nội 
      Địa chỉ ngõ 51 tương mai gần neu
      👉Phòng đầy đủ nội thất như hình 
      👉Tài chính 3tr8
      🍀Xem phòng freee 
      🌟Ib ngay cho e để biết thêm tt ạ 
       ☎️ Liên hệ :  Za.lo 0971537189
      `,
    }),
    fakeUnit(propertyIds[9], {
      id: unitIds[14],
      name: 'Phòng cho nữ thuê',
      area: 20,
      price: 4_000_000,
      deposit: 4_000_000,
      status: UnitStatus.GOOD,
      imgUrls: [
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/901.jpg',
        'https://srhsxpldcmvytzpynctu.supabase.co/storage/v1/object/public/Image/Seeding/902.jpg',
      ],
      description: `CÒN 1 PHÒNG DUY NHẤT CHO NỮ THUÊ - PHƯỜNG MINH KHAI, QUẬN HAI BÀ TRƯNG, HÀ NỘI
      - Địa chỉ: Phường Minh Khai, Quận Hai Bà Trưng, Hà Nội
      - Diện tích: 20m2
      - Có chỗ nấu ăn, có thang thoát hiểm, có ban công thoáng mát.
      - Phòng có đủ đồ như hình.
      - phòng có vị trí đẹp. Nhà xây mới đét. Nhà cách phố 50m.
      - Khu ở dân cư đông, an ninh tốt, hàng xóm thân thiện dễ gần, văn minh lịch sự.
      - Xung quanh đầy đủ các tiện ích khác nhau: gần trường Bách Kinh Xây, Công Nghệ, gần chợ, siêu thị, trung tâm,...
      - Rất phù hợp để an cư sinh sống (cho nữ thuê) chỉ việc xách valy vào ở.
      + Giá Thuê: 4tr/tháng
      => Liên Hệ Xem Phòng: 0973258928 (cô Hồng Thanh)`,
    }),
  ];

  writeFileSync('prisma/seed/data/units.json', JSON.stringify(units, null, 2));

  tenants.push(
    fakeMember({
      id: 'c7be62dd-4e32-42a3-b37d-0e9103339668',
      email: 'khang194591@gmail.com',
      password: hashSync('123456', 10),
      role: MemberRole.TENANT,
      name: 'Khang Trịnh',
      imgUrl:
        'https://lh3.googleusercontent.com/a/ACg8ocJ-wyEURnuJjTv_eY9Fgf_KPd4QA75b_A5D06wJ63IB7gKjOUUv=s288-c-no',
    }),
  );

  tenants.push(
    fakeMember({
      id: '3c8f96f8-57c8-4846-9826-59b1277e9b63',
      email: 'khang.td194591@sis.hust.edu.vn',
      password: hashSync('123456', 10),
      role: MemberRole.TENANT,
      name: 'Trịnh Khang',
      imgUrl: 'https://avatar.iran.liara.run/public/03',
    }),
  );

  writeFileSync(
    'prisma/seed/data/tenants.json',
    JSON.stringify(tenants, null, 2),
  );
  writeFileSync(
    'prisma/seed/data/landlords.json',
    JSON.stringify(landlords, null, 2),
  );

  await prisma.member.createMany({
    skipDuplicates: true,
    data: [...tenants, ...landlords],
  });

  await prisma.equipmentCategory.createMany({
    skipDuplicates: true,
    data: equipmentCategories.map((name) => ({ name })),
  });

  await prisma.propertyAmenity.createMany({
    skipDuplicates: true,
    data: propertyAmenities.map((name) => ({ name })),
  });

  await prisma.unitFeature.createMany({
    skipDuplicates: true,
    data: unitFeatures.map((name) => ({ name })),
  });

  await prisma.$transaction(
    properties.map((property) => prisma.property.create({ data: property })),
  );

  const createdUnits = await prisma.$transaction(
    units.map((unit) =>
      prisma.unit.create({ data: unit, include: { property: true } }),
    ),
  );

  const shuffledMembers = tenants.sort(() => 0.5 - Math.random());

  await prisma.$transaction(
    shuffledMembers.flatMap((member) => {
      const unit = getRandomItemInArray(createdUnits);
      return [
        prisma.unit.update({
          where: { id: unit.id },
          data: {
            payerId: member.id,
            tenants: { connect: { id: member.id } },
            reviews: {
              create: {
                rating: randomInt(1, 6),
                comment: faker.lorem.sentence(),
                authorId: member.id,
              },
            },
          },
        }),
        prisma.member.update({
          where: { id: unit.property.ownerId },
          data: {
            contacts: {
              create: { type: ContactType.TENANT, contactWithId: member.id },
            },
          },
        }),
        prisma.member.update({
          where: { id: member.id },
          data: {
            sentReviews:
              randomInt(10) < 8
                ? {
                    createMany: {
                      data: {
                        rating: randomInt(1, 6),
                        comment: faker.lorem.sentence(),
                        propertyId: unit.propertyId,
                      },
                      skipDuplicates: true,
                    },
                  }
                : undefined,
          },
        }),
        prisma.contract.create({
          data: fakeContract(
            unit.property.ownerId,
            member.id,
            unit.id,
            unit.price,
            unit.deposit,
          ),
        }),
      ];
    }),
  );

  const contacts = await prisma.memberContacts.findMany({});

  await prisma.memberContacts.createMany({
    skipDuplicates: true,
    data: contacts.map((contact) => ({
      type: ContactType.TENANT,
      contactId: contact.contactWithId,
      contactWithId: contact.contactId,
    })),
  });

  await prisma.unit.updateMany({
    data: { isListing: true },
    where: { payerId: null },
  });

  const activeContracts = await prisma.contract.findMany({
    where: { status: 'ACTIVE' },
    include: {
      unit: true,
    },
  });

  await Promise.all(
    activeContracts.map(async (contract) => {
      const startOfMonth = dayjs().startOf('month');
      // eslint-disable-next-line prefer-const
      let { startDate, unit } = contract;
      let prevWater = 0;
      let prevElectric = 0;
      let currentWater = randomInt(1, 5);
      let currentElectric = randomInt(50, 150);
      await prisma.unitPriceLog.updateMany({
        where: {
          unitId: unit.id,
        },
        data: {
          createdAt: contract.startDate,
          updatedAt: contract.startDate,
        },
      });
      while (dayjs(startDate).startOf('month').isBefore(startOfMonth)) {
        const month = dayjs(startDate).format('MM/YYYY');
        await prisma.unitPriceLog.createMany({
          data: [
            {
              category: 'WATER',
              price: 40000,
              status: 0,
              value: +currentWater,
              unitId: unit.id,
              createdAt: dayjs(startDate).endOf('month').toDate(),
              updatedAt: dayjs(startDate).endOf('month').toDate(),
            },
            {
              category: 'ELECTRICITY',
              price: 4000,
              status: 0,
              value: +currentElectric,
              unitId: unit.id,
              createdAt: dayjs(startDate).endOf('month').toDate(),
              updatedAt: dayjs(startDate).endOf('month').toDate(),
            },
          ],
        });
        await prisma.invoice.create({
          data: {
            category: 'MERGED',
            dueDate: dayjs(startDate).endOf('month').add(2, 'week').toDate(),
            status: 'PAID',
            total: unit.price.add(
              (currentElectric - prevElectric) * 4000 +
                (currentWater - prevWater) * 40000,
            ),
            unitId: unit.id,
            memberId: unit.payerId,
            items: {
              createMany: {
                data: [
                  {
                    amount: 1,
                    price: unit.price,
                    description: `Unit lease charge ${month}`,
                  },
                  {
                    amount: currentWater - prevWater,
                    price: 40000,
                    description: `Water fee ${month}`,
                  },
                  {
                    amount: currentElectric - prevElectric,
                    price: 4000,
                    description: `Electric fee ${month}`,
                  },
                ],
              },
            },
          },
        });
        startDate = dayjs(startDate).startOf('month').add(1, 'month').toDate();
        prevWater = currentWater;
        prevElectric = currentElectric;
        currentWater += randomInt(1, 5);
        currentElectric += randomInt(50, 150);
      }
    }),
  );
};

const runSeed = async () => {
  let hasError = true;
  do {
    try {
      await seed();
      hasError = false;
    } catch (error) {
      console.error(error);
    }
  } while (hasError);
};

void runSeed();
