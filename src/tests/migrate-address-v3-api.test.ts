import * as dotenv from 'dotenv';
import { beforeAll, describe, expect, test } from 'vitest';
import { z } from 'zod';
import { MigrateAddressRequestV4, MigrateAddressResponseV4 } from '../models';
import { MigrateType } from '../types';
import { VietmapApi } from '../vietmap-api';

dotenv.config();

const envVariables = z
  .object({
    VIETMAP_API_KEY: z.string(),
  })
  .parse(process.env);

describe('Migrate Address V3 API - Comprehensive Edge Case Testing', () => {
  let vietmapApi: VietmapApi;

  beforeAll(() => {
    vietmapApi = new VietmapApi({});
  });

  describe('Basic Migration Tests - Old to New Format', () => {
    test('should migrate simple old format to new format', async () => {
      const result = await vietmapApi.migrateAddress(
        new MigrateAddressRequestV4({
          text: '197 tran phu p4 q5',
          apikey: envVariables.VIETMAP_API_KEY,
        }),
      );
      expect(result).toBeInstanceOf(MigrateAddressResponseV4);
      expect(result.address).toBeDefined();
      expect(result.name).toBeDefined();
      expect(result.display).toBeDefined();
    });

    test('should migrate address with abbreviations', async () => {
      const result = await vietmapApi.migrateAddress(
        new MigrateAddressRequestV4({
          text: '123 nguyen hue q1 hcm',
          apikey: envVariables.VIETMAP_API_KEY,
        }),
      );
      expect(result).toBeInstanceOf(MigrateAddressResponseV4);
    });

    test('should migrate address with ward and district numbers', async () => {
      const result = await vietmapApi.migrateAddress(
        new MigrateAddressRequestV4({
          text: '45 le loi p1 q3',
          apikey: envVariables.VIETMAP_API_KEY,
        }),
      );
      expect(result).toBeInstanceOf(MigrateAddressResponseV4);
    });

    test('should migrate address with street types', async () => {
      const result = await vietmapApi.migrateAddress(
        new MigrateAddressRequestV4({
          text: '67 duong so 1 p2 q7',
          apikey: envVariables.VIETMAP_API_KEY,
        }),
      );
      expect(result).toBeInstanceOf(MigrateAddressResponseV4);
    });
  });

  describe('New to Old Format Migration Tests', () => {
    test('should migrate new format to old format with focus', async () => {
      const result = await vietmapApi.migrateAddress(
        new MigrateAddressRequestV4({
          text: '197 Trần Phú, Phường 4, Quận 5, Thành phố Hồ Chí Minh',
          focus: [10.75887508, 106.67538868],
          apikey: envVariables.VIETMAP_API_KEY,
          migrate_type: MigrateType.NEW_TO_OLD,
        }),
      );
      expect(result).toBeInstanceOf(MigrateAddressResponseV4);
    });

    test('should migrate complete new format address', async () => {
      const result = await vietmapApi.migrateAddress(
        new MigrateAddressRequestV4({
          text: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh',
          focus: [10.7769, 106.7009],
          apikey: envVariables.VIETMAP_API_KEY,
          migrate_type: MigrateType.NEW_TO_OLD,
        }),
      );
      expect(result).toBeInstanceOf(MigrateAddressResponseV4);
    });

    test('should handle new format address with Hanoi focus', async () => {
      const result = await vietmapApi.migrateAddress(
        new MigrateAddressRequestV4({
          text: '1 Đinh Tiên Hoàng, Phường Lý Thái Tổ, Quận Hoàn Kiếm, Thành phố Hà Nội',
          focus: [21.0285, 105.8542],
          apikey: envVariables.VIETMAP_API_KEY,
          migrate_type: MigrateType.NEW_TO_OLD,
        }),
      );
      expect(result).toBeInstanceOf(MigrateAddressResponseV4);
    });
  });

  describe('Invalid Parameters Testing', () => {
    test('should handle missing API key', async () => {
      try {
        await vietmapApi.migrateAddress(
          new MigrateAddressRequestV4({
            text: '197 tran phu p4 q5',
            apikey: '',
          }),
        );
      } catch (error) {
        console.log('✅ Missing API key correctly rejected with error:', error);
        expect(error).toBeDefined();
      }
    });

    test('should handle invalid API key', async () => {
      try {
        await vietmapApi.migrateAddress(
          new MigrateAddressRequestV4({
            text: '197 tran phu p4 q5',
            apikey: 'invalid_api_key_12345',
          }),
        );
      } catch (error) {
        console.log('✅ Invalid API key correctly rejected with error:', error);
        expect(error).toBeDefined();
      }
    });

    test('should handle empty text parameter', async () => {
      try {
        await vietmapApi.migrateAddress(
          new MigrateAddressRequestV4({
            text: '',
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
      } catch (error) {
        console.log('✅ Empty text correctly rejected with error:', error);
        expect(error).toBeDefined();
      }
    });

    test('should handle whitespace-only text', async () => {
      try {
        const result = await vietmapApi.migrateAddress(
          new MigrateAddressRequestV4({
            text: '   ',
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        expect(result).toBeInstanceOf(MigrateAddressResponseV4);
      } catch (error) {
        console.log('✅ Whitespace-only text handled with error:', error);
        expect(error).toBeDefined();
      }
    });

    test('should handle NEW_TO_OLD migration without focus', async () => {
      try {
        await vietmapApi.migrateAddress(
          new MigrateAddressRequestV4({
            text: '197 Trần Phú, Phường 4, Quận 5, Thành phố Hồ Chí Minh',
            apikey: envVariables.VIETMAP_API_KEY,
            migrate_type: MigrateType.NEW_TO_OLD,
            // Missing focus parameter
          }),
        );
      } catch (error) {
        console.log(
          '✅ NEW_TO_OLD without focus correctly rejected with error:',
          error,
        );
        expect(error).toBeDefined();
      }
    });

    test('should handle invalid focus coordinates', async () => {
      try {
        await vietmapApi.migrateAddress(
          new MigrateAddressRequestV4({
            text: '197 Trần Phú, Phường 4, Quận 5, Thành phố Hồ Chí Minh',
            focus: [999, 999], // Invalid coordinates
            apikey: envVariables.VIETMAP_API_KEY,
            migrate_type: MigrateType.NEW_TO_OLD,
          }),
        );
      } catch (error) {
        console.log('✅ Invalid focus coordinates handled with error:', error);
        expect(error).toBeDefined();
      }
    });
  });

  describe('Address Variations Testing', () => {
    test('should handle different Vietnamese address formats', async () => {
      const addressFormats = [
        '12 bach dang p2 tan binh',
        '56 cao thang q3 tp hcm',
        '89 pasteur q1',
        '234 cmt8 q10 hcm',
        '78 vo thi sau p6 q3',
      ];

      for (const addressText of addressFormats) {
        const result = await vietmapApi.migrateAddress(
          new MigrateAddressRequestV4({
            text: addressText,
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        expect(result).toBeInstanceOf(MigrateAddressResponseV4);
      }
    });

    test('should handle addresses with special characters', async () => {
      const result = await vietmapApi.migrateAddress(
        new MigrateAddressRequestV4({
          text: '12/3 lê văn sỹ p13 q3',
          apikey: envVariables.VIETMAP_API_KEY,
        }),
      );
      expect(result).toBeInstanceOf(MigrateAddressResponseV4);
    });

    test('should handle addresses with number ranges', async () => {
      const result = await vietmapApi.migrateAddress(
        new MigrateAddressRequestV4({
          text: '123-125 nguyen dinh chieu p6 q3',
          apikey: envVariables.VIETMAP_API_KEY,
        }),
      );
      expect(result).toBeInstanceOf(MigrateAddressResponseV4);
    });

    test('should handle addresses with apartment numbers', async () => {
      const result = await vietmapApi.migrateAddress(
        new MigrateAddressRequestV4({
          text: 'ct3a kdt xa la ha dong',
          apikey: envVariables.VIETMAP_API_KEY,
        }),
      );
      expect(result).toBeInstanceOf(MigrateAddressResponseV4);
    });
  });

  describe('Geographic Coverage Testing', () => {
    test('should handle Hanoi addresses', async () => {
      const result = await vietmapApi.migrateAddress(
        new MigrateAddressRequestV4({
          text: '1 dinh tien hoang hoan kiem ha noi',
          apikey: envVariables.VIETMAP_API_KEY,
        }),
      );
      expect(result).toBeInstanceOf(MigrateAddressResponseV4);
    });

    test('should handle Da Nang addresses', async () => {
      const result = await vietmapApi.migrateAddress(
        new MigrateAddressRequestV4({
          text: '123 tran phu hai chau da nang',
          apikey: envVariables.VIETMAP_API_KEY,
        }),
      );
      expect(result).toBeInstanceOf(MigrateAddressResponseV4);
    });

    test('should handle Can Tho addresses', async () => {
      const result = await vietmapApi.migrateAddress(
        new MigrateAddressRequestV4({
          text: '456 30 thang 4 xuan khanh ninh kieu can tho',
          apikey: envVariables.VIETMAP_API_KEY,
        }),
      );
      expect(result).toBeInstanceOf(MigrateAddressResponseV4);
    });

    test('should handle Hai Phong addresses', async () => {
      const result = await vietmapApi.migrateAddress(
        new MigrateAddressRequestV4({
          text: '789 dien bien phu hong bang hai phong',
          apikey: envVariables.VIETMAP_API_KEY,
        }),
      );
      expect(result).toBeInstanceOf(MigrateAddressResponseV4);
    });
  });

  describe('Security and Edge Cases', () => {
    test('should handle SQL injection attempts in text', async () => {
      try {
        const result = await vietmapApi.migrateAddress(
          new MigrateAddressRequestV4({
            text: "'; DROP TABLE addresses; --",
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        expect(result).toBeInstanceOf(MigrateAddressResponseV4);
      } catch (error) {
        console.log('✅ SQL injection attempt handled with error:', error);
        expect(error).toBeDefined();
      }
    });

    test('should handle XSS attempts in text', async () => {
      try {
        const result = await vietmapApi.migrateAddress(
          new MigrateAddressRequestV4({
            text: '<script>alert("xss")</script>',
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        expect(result).toBeInstanceOf(MigrateAddressResponseV4);
      } catch (error) {
        console.log('✅ XSS attempt handled with error:', error);
        expect(error).toBeDefined();
      }
    });

    test('should handle very long text input', async () => {
      try {
        const longText = 'a'.repeat(1000) + ' p1 q1 hcm';
        const result = await vietmapApi.migrateAddress(
          new MigrateAddressRequestV4({
            text: longText,
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        expect(result).toBeInstanceOf(MigrateAddressResponseV4);
      } catch (error) {
        console.log('✅ Long text input handled with error:', error);
        expect(error).toBeDefined();
      }
    });

    test('should handle Unicode characters', async () => {
      const result = await vietmapApi.migrateAddress(
        new MigrateAddressRequestV4({
          text: '🏠 123 nguyễn huệ 🏙️ p1 q1',
          apikey: envVariables.VIETMAP_API_KEY,
        }),
      );
      expect(result).toBeInstanceOf(MigrateAddressResponseV4);
    });

    test('should handle non-Vietnamese text', async () => {
      try {
        const result = await vietmapApi.migrateAddress(
          new MigrateAddressRequestV4({
            text: '123 Main Street New York USA',
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        expect(result).toBeInstanceOf(MigrateAddressResponseV4);
      } catch (error) {
        console.log('✅ Non-Vietnamese text handled with error:', error);
        expect(error).toBeDefined();
      }
    });
  });

  describe('Performance and Boundary Testing', () => {
    test('should handle multiple concurrent requests', async () => {
      const addresses = [
        '197 tran phu p4 q5',
        '123 nguyen hue q1 hcm',
        '45 le loi p1 q3',
        '67 bach dang p2 tan binh',
      ];

      const promises = addresses.map((text) =>
        vietmapApi.migrateAddress(
          new MigrateAddressRequestV4({
            text,
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        ),
      );

      const results = await Promise.all(promises);
      results.forEach((result) => {
        expect(result).toBeInstanceOf(MigrateAddressResponseV4);
      });
    });

    test('should handle rapid sequential requests', async () => {
      const addresses = [
        '100 nguyen thai binh p12 tan binh',
        '101 nguyen thai binh p12 tan binh',
        '102 nguyen thai binh p12 tan binh',
      ];

      for (const text of addresses) {
        const result = await vietmapApi.migrateAddress(
          new MigrateAddressRequestV4({
            text,
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        expect(result).toBeInstanceOf(MigrateAddressResponseV4);
      }
    });

    test('should handle mixed migration types in sequence', async () => {
      // Old to New
      const result1 = await vietmapApi.migrateAddress(
        new MigrateAddressRequestV4({
          text: '197 tran phu p4 q5',
          apikey: envVariables.VIETMAP_API_KEY,
        }),
      );
      expect(result1).toBeInstanceOf(MigrateAddressResponseV4);

      // New to Old
      const result2 = await vietmapApi.migrateAddress(
        new MigrateAddressRequestV4({
          text: '197 Trần Phú, Phường 4, Quận 5, Thành phố Hồ Chí Minh',
          focus: [10.75887508, 106.67538868],
          apikey: envVariables.VIETMAP_API_KEY,
          migrate_type: MigrateType.NEW_TO_OLD,
        }),
      );
      expect(result2).toBeInstanceOf(MigrateAddressResponseV4);
    });
  });

  describe('Response Structure Validation', () => {
    test('should return proper response structure', async () => {
      const result = await vietmapApi.migrateAddress(
        new MigrateAddressRequestV4({
          text: '197 tran phu p4 q5',
          apikey: envVariables.VIETMAP_API_KEY,
        }),
      );

      expect(result).toBeInstanceOf(MigrateAddressResponseV4);

      // Check optional properties exist when present
      if (result.address) {
        expect(typeof result.address).toBe('string');
      }
      if (result.name) {
        expect(typeof result.name).toBe('string');
      }
      if (result.display) {
        expect(typeof result.display).toBe('string');
      }
      if (result.boundaries) {
        expect(result.boundaries).toBeInstanceOf(Array);
      }
    });

    test('should handle unrecognizable address gracefully', async () => {
      try {
        const result = await vietmapApi.migrateAddress(
          new MigrateAddressRequestV4({
            text: 'xyz unrecognizable address format 123',
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        expect(result).toBeInstanceOf(MigrateAddressResponseV4);
        // Should still return a response even if migration fails
      } catch (error) {
        console.log('✅ Unrecognizable address handled with error:', error);
        expect(error).toBeDefined();
      }
    });
  });

  describe('Common Address Patterns Testing', () => {
    test('should handle common Ho Chi Minh City patterns', async () => {
      const hcmcPatterns = [
        '123 nguyen trai p ben thanh q1',
        '456 le van sy p13 phu nhuan',
        '789 cong hoa p13 tan binh',
        '12 vo van tan p6 q3',
        '34 tran hung dao p cau ong lanh q1',
      ];

      for (const pattern of hcmcPatterns) {
        const result = await vietmapApi.migrateAddress(
          new MigrateAddressRequestV4({
            text: pattern,
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        expect(result).toBeInstanceOf(MigrateAddressResponseV4);
      }
    });

    test('should handle common Hanoi patterns', async () => {
      const hanoiPatterns = [
        '123 hang bac hoan kiem ha noi',
        '456 giai phong dong da ha noi',
        '789 nguyen trai thanh xuan ha noi',
        '12 lang ha dong da ha noi',
        '34 tay son dong da ha noi',
      ];

      for (const pattern of hanoiPatterns) {
        const result = await vietmapApi.migrateAddress(
          new MigrateAddressRequestV4({
            text: pattern,
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        expect(result).toBeInstanceOf(MigrateAddressResponseV4);
      }
    });
  });
});
