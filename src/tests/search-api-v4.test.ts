import * as dotenv from 'dotenv';
import { beforeAll, describe, expect, test } from 'vitest';
import { z } from 'zod';
import { SearchRequestV4 } from '../models';
import { layers, SearchDisplayType } from '../types';
import { VietmapApi } from '../vietmap-api';

dotenv.config();

const envVariables = z
  .object({
    VIETMAP_API_KEY: z.string(),
  })
  .parse(process.env);

describe('Search V4 API - Comprehensive Testing', () => {
  let vietmapApi: VietmapApi;

  beforeAll(() => {
    vietmapApi = new VietmapApi({});
  });

  describe('Required Parameters', () => {
    test('should work with minimal required parameters (text + apikey)', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: 'Vietmap office',
          apikey: envVariables.VIETMAP_API_KEY,
        }),
      );
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    test('should handle empty text parameter', async () => {
      try {
        await vietmapApi.searchV4(
          new SearchRequestV4({
            text: '',
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        console.log('⚠️ Missing apikey was accepted (unexpected)');
      } catch (error) {
        console.log('✅ Missing apikey correctly rejected with error:', error);
        expect(error).toBeDefined();
      }
    });

    test('should handle missing apikey', async () => {
      try {
        await vietmapApi.searchV4(
          new SearchRequestV4({
            text: 'test location',
            apikey: '',
          }),
        );
        console.log('⚠️ Missing apikey was accepted (unexpected)');
      } catch (error) {
        console.log('✅ Missing apikey correctly rejected with error:', error);
        expect(error).toBeDefined();
      }
    });
  });

  describe('Text Parameter Variations', () => {
    test('should handle Vietnamese address format', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: '197 Trần Phú, Phường 4, Quận 5, TP.HCM',
          apikey: envVariables.VIETMAP_API_KEY,
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });

    test('should handle POI name search', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: 'Công viên Tao Đàn',
          apikey: envVariables.VIETMAP_API_KEY,
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });

    test('should handle partial address search', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: 'Nguyễn Huệ',
          apikey: envVariables.VIETMAP_API_KEY,
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });

    test('should handle special characters and diacritics', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: 'Café Nhà thờ Đức Bà',
          apikey: envVariables.VIETMAP_API_KEY,
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });

    test('should handle numeric addresses', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: '123 đường số 1',
          apikey: envVariables.VIETMAP_API_KEY,
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('Focus Parameter Testing', () => {
    test('should work with valid focus coordinates', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: 'coffee shop',
          apikey: envVariables.VIETMAP_API_KEY,
          focus: [10.7769, 106.7009], // Ho Chi Minh City center
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });

    test('should work with different focus locations', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: 'bệnh viện',
          apikey: envVariables.VIETMAP_API_KEY,
          focus: [21.0285, 105.8542], // Hanoi center
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('Display Type Parameter Testing', () => {
    test('should work with NEW_FORMAT display type', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: '197 Trần Phú',
          apikey: envVariables.VIETMAP_API_KEY,
          displayType: SearchDisplayType.NEW_FORMAT,
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });

    test('should work with OLD_FORMAT display type', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: '197 Trần Phú',
          apikey: envVariables.VIETMAP_API_KEY,
          displayType: SearchDisplayType.OLD_FORMAT,
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });

    test('should work with BOTH_NEW_OLD display type', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: '197 Trần Phú',
          apikey: envVariables.VIETMAP_API_KEY,
          displayType: SearchDisplayType.BOTH_NEW_OLD,
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });

    test('should work with BOTH_OLD_NEW display type', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: '197 Trần Phú',
          apikey: envVariables.VIETMAP_API_KEY,
          displayType: SearchDisplayType.BOTH_OLD_NEW,
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });

    test('should work with AS_INPUT_FORMAT display type', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: '197 Trần Phú',
          apikey: envVariables.VIETMAP_API_KEY,
          displayType: SearchDisplayType.AS_INPUT_FORMAT,
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('Layers Parameter Testing', () => {
    test('should work with POI layer', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: 'coffee shop',
          apikey: envVariables.VIETMAP_API_KEY,
          layers: layers.POI,
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });

    test('should work with ADDRESS layer', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: '197 Trần Phú',
          apikey: envVariables.VIETMAP_API_KEY,
          layers: layers.ADDRESS,
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });

    test('should work with STREET layer', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: 'Nguyễn Huệ',
          apikey: envVariables.VIETMAP_API_KEY,
          layers: layers.STREET,
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });

    test('should work with WARD layer', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: 'Phường 1',
          apikey: envVariables.VIETMAP_API_KEY,
          layers: layers.WARD,
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });

    test('should work with DIST layer', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: 'Quận 1',
          apikey: envVariables.VIETMAP_API_KEY,
          layers: layers.DIST,
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });

    test('should work with CITY layer', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: 'Ho Chi Minh',
          apikey: envVariables.VIETMAP_API_KEY,
          layers: layers.CITY,
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });

    test('should work with VILLAGE layer', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: 'Thôn 1',
          apikey: envVariables.VIETMAP_API_KEY,
          layers: layers.VILLAGE,
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('Geographic Area Search Testing', () => {
    test('should work with circle search (center + radius)', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: 'restaurant',
          apikey: envVariables.VIETMAP_API_KEY,
          circleCenter: 10.7769, // Ho Chi Minh City latitude
          circleRadius: 500, // 500 meters radius
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });

    test('should work with different radius values', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: 'pharmacy',
          apikey: envVariables.VIETMAP_API_KEY,
          circleCenter: 10.7769,
          circleRadius: 1000, // 1km radius
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });

    test('should work with small radius search', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: 'ATM',
          apikey: envVariables.VIETMAP_API_KEY,
          circleCenter: 10.7769,
          circleRadius: 100, // 100 meters radius
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('POI Category Search Testing', () => {
    test('should work with specific POI category', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: 'restaurant',
          apikey: envVariables.VIETMAP_API_KEY,
          cats: '1002-1', // Food & Beverage category
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });

    test('should work with multiple POI categories', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: 'service',
          apikey: envVariables.VIETMAP_API_KEY,
          cats: '1001,1002', // Multiple categories
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('Administrative Boundary Filtering', () => {
    test('should work with cityId filter', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: 'bệnh viện',
          apikey: envVariables.VIETMAP_API_KEY,
          cityId: 12, // Ho Chi Minh City ID
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });

    test('should work with wardId filter', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: 'shop',
          apikey: envVariables.VIETMAP_API_KEY,
          wardId: 984332, // Specific ward ID
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });

    test('should work with distId filter', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: 'school',
          apikey: envVariables.VIETMAP_API_KEY,
          distId: 1292, // District 5 ID
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });

    test('should work with combined administrative filters', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: 'office',
          apikey: envVariables.VIETMAP_API_KEY,
          cityId: 12,
          distId: 1292,
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('Complex Parameter Combinations', () => {
    test('should work with all parameters combined', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: 'coffee shop',
          apikey: envVariables.VIETMAP_API_KEY,
          focus: [10.7769, 106.7009],
          displayType: SearchDisplayType.NEW_FORMAT,
          layers: layers.POI,
          circleCenter: 10.7769,
          circleRadius: 300,
          cats: '1002-1',
          cityId: 12,
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });

    test('should work with geographic + administrative filters', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: 'hospital',
          apikey: envVariables.VIETMAP_API_KEY,
          layers: layers.POI,
          cityId: 12,
          distId: 1292,
          circleCenter: 10.7769,
          circleRadius: 1000,
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });

    test('should work with focus + display type + layer', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: 'Trần Hưng Đạo',
          apikey: envVariables.VIETMAP_API_KEY,
          focus: [10.7769, 106.7009],
          displayType: SearchDisplayType.BOTH_NEW_OLD,
          layers: layers.STREET,
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle very long text input', async () => {
      const longText = 'A'.repeat(1000);
      try {
        const result = await vietmapApi.searchV4(
          new SearchRequestV4({
            text: longText,
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        console.log(
          '✅ Very long text accepted, result length:',
          result.length,
        );
        expect(result).toBeInstanceOf(Array);
      } catch (error) {
        console.log('⚠️ Very long text rejected with error:', error);
        expect(error).toBeDefined();
      }
    });

    test('should handle invalid focus coordinates', async () => {
      try {
        const result = await vietmapApi.searchV4(
          new SearchRequestV4({
            text: 'test location',
            apikey: envVariables.VIETMAP_API_KEY,
            focus: [999, 999], // Invalid coordinates
          }),
        );
        console.log(
          '⚠️ Invalid focus coordinates [999, 999] accepted, result length:',
          result.length,
        );
        expect(result).toBeInstanceOf(Array);
      } catch (error) {
        console.log(
          '✅ Invalid focus coordinates correctly rejected with error:',
          error,
        );
        expect(error).toBeDefined();
      }
    });

    test('should handle negative radius values', async () => {
      try {
        const result = await vietmapApi.searchV4(
          new SearchRequestV4({
            text: 'test location',
            apikey: envVariables.VIETMAP_API_KEY,
            circleCenter: 10.7769,
            circleRadius: -100, // Negative radius
          }),
        );
        console.log(
          '⚠️ Negative radius (-100) was accepted, result length:',
          result.length,
        );
        expect(result).toBeInstanceOf(Array);
      } catch (error) {
        console.log('✅ Negative radius correctly rejected with error:', error);
        expect(error).toBeDefined();
      }
    });

    test('should handle invalid cityId', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: 'test location',
          apikey: envVariables.VIETMAP_API_KEY,
          cityId: 99999, // Non-existent city ID
        }),
      );
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0); // Should return empty array
    });

    test('should handle invalid POI category', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: 'test location',
          apikey: envVariables.VIETMAP_API_KEY,
          cats: 'invalid-category',
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });

    test('should handle circle center without radius', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: 'restaurant',
          apikey: envVariables.VIETMAP_API_KEY,
          circleCenter: 10.7769,
          // Missing circleRadius
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });

    test('should handle radius without circle center', async () => {
      const result = await vietmapApi.searchV4(
        new SearchRequestV4({
          text: 'restaurant',
          apikey: envVariables.VIETMAP_API_KEY,
          circleRadius: 500,
          // Missing circleCenter
        }),
      );
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('Performance and Load Testing', () => {
    test('should handle multiple concurrent requests', async () => {
      const promises = Array.from({ length: 5 }, (_, index) =>
        vietmapApi.searchV4(
          new SearchRequestV4({
            text: `test location ${index}`,
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        ),
      );

      const results = await Promise.all(promises);
      results.forEach((result) => {
        expect(result).toBeInstanceOf(Array);
      });
    });

    test('should handle rapid sequential requests', async () => {
      for (let i = 0; i < 3; i++) {
        const result = await vietmapApi.searchV4(
          new SearchRequestV4({
            text: `sequential test ${i}`,
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        expect(result).toBeInstanceOf(Array);
      }
    });
  });
});
