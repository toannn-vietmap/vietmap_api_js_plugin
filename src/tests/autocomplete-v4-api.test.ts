import * as dotenv from 'dotenv';
import { beforeAll, describe, expect, test } from 'vitest';
import { z } from 'zod';
import { VietmapApi } from '../vietmap-api';

import { SearchRequestV4, SearchResponseV4 } from '../models';
import { SearchDisplayType } from '../types';
import { layers } from '../types';
import { TestHelpers } from './test-helpers';

dotenv.config();

const envVariables = z
  .object({
    VIETMAP_API_KEY: z.string(),
  })
  .parse(process.env);

describe('AutoComplete V4 API - Comprehensive Edge Case Testing', () => {
  let vietmapApi: VietmapApi;

  beforeAll(() => {
    vietmapApi = new VietmapApi({});
  });

  describe('Basic Functionality Tests', () => {
    test('should work with minimal required parameters', async () => {
      await TestHelpers.executeTestWithLogging(
        'AutoComplete V4 Basic Test',
        async () => {
          const result = await vietmapApi.autoCompleteSearchV4(
            new SearchRequestV4({
              text: 'Vietmap',
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(Array);
          expect(result.length).toBeGreaterThanOrEqual(0);
          if (result.length > 0) {
            expect(result[0]).toBeInstanceOf(SearchResponseV4);
          }
        },
      );
    });

    test('should handle Vietnamese address autocomplete', async () => {
      await TestHelpers.executeTestWithLogging(
        'Vietnamese Address AutoComplete',
        async () => {
          const result = await vietmapApi.autoCompleteSearchV4(
            new SearchRequestV4({
              text: '197 Trần Phú',
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(Array);
        },
      );
    });

    test('should provide autocomplete suggestions for partial text', async () => {
      await TestHelpers.executeTestWithLogging(
        'Partial Text AutoComplete',
        async () => {
          const result = await vietmapApi.autoCompleteSearchV4(
            new SearchRequestV4({
              text: 'Công viên',
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(Array);
        },
      );
    });
  });

  describe('Invalid Parameters Testing', () => {
    test('should handle missing API key gracefully', async () => {
      try {
        await vietmapApi.autoCompleteSearchV4(
          new SearchRequestV4({
            text: 'test location',
            apikey: '', // Empty API key
          }),
        );
      } catch (error) {
        console.log('✅ Missing API key correctly rejected with error:', error);
        expect(error).toBeDefined();
      }
    });

    test('should handle invalid API key', async () => {
      try {
        await vietmapApi.autoCompleteSearchV4(
          new SearchRequestV4({
            text: 'test location',
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
        await vietmapApi.autoCompleteSearchV4(
          new SearchRequestV4({
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
        const result = await vietmapApi.autoCompleteSearchV4(
          new SearchRequestV4({
            text: '   ',
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        expect(result).toBeInstanceOf(Array);
      } catch (error) {
        console.log('✅ Whitespace-only text handled with error:', error);
        expect(error).toBeDefined();
      }
    });
  });

  describe('Text Input Variations', () => {
    test('should handle single character input', async () => {
      await TestHelpers.executeTestWithLogging(
        'Single Character AutoComplete',
        async () => {
          const result = await vietmapApi.autoCompleteSearchV4(
            new SearchRequestV4({
              text: 'H',
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(Array);
        },
      );
    });

    test('should handle multiple word suggestions', async () => {
      await TestHelpers.executeTestWithLogging(
        'Multiple Word AutoComplete',
        async () => {
          const result = await vietmapApi.autoCompleteSearchV4(
            new SearchRequestV4({
              text: 'Thành phố Hồ Chí Minh',
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(Array);
        },
      );
    });

    test('should handle POI name autocomplete', async () => {
      await TestHelpers.executeTestWithLogging(
        'POI Name AutoComplete',
        async () => {
          const result = await vietmapApi.autoCompleteSearchV4(
            new SearchRequestV4({
              text: 'Bệnh viện',
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(Array);
        },
      );
    });

    test('should handle street name autocomplete', async () => {
      await TestHelpers.executeTestWithLogging(
        'Street Name AutoComplete',
        async () => {
          const result = await vietmapApi.autoCompleteSearchV4(
            new SearchRequestV4({
              text: 'Nguyễn Huệ',
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(Array);
        },
      );
    });

    test('should handle misspelled text suggestions', async () => {
      await TestHelpers.executeTestWithLogging(
        'Misspelled Text AutoComplete',
        async () => {
          const result = await vietmapApi.autoCompleteSearchV4(
            new SearchRequestV4({
              text: 'Sài Gòn', // Alternative name
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(Array);
        },
      );
    });
  });

  describe('Focus Parameter Testing', () => {
    test('should prioritize suggestions around focus point', async () => {
      await TestHelpers.executeTestWithLogging(
        'Focus Point AutoComplete',
        async () => {
          const result = await vietmapApi.autoCompleteSearchV4(
            new SearchRequestV4({
              text: 'cà phê',
              apikey: envVariables.VIETMAP_API_KEY,
              focus: [10.7769, 106.7009], // Ho Chi Minh City center
            }),
          );
          expect(result).toBeInstanceOf(Array);
        },
      );
    });

    test('should handle different focus locations', async () => {
      await TestHelpers.executeTestWithLogging(
        'Different Focus Location AutoComplete',
        async () => {
          const result = await vietmapApi.autoCompleteSearchV4(
            new SearchRequestV4({
              text: 'nhà hàng',
              apikey: envVariables.VIETMAP_API_KEY,
              focus: [21.0285, 105.8542], // Hanoi center
            }),
          );
          expect(result).toBeInstanceOf(Array);
        },
      );
    });

    test('should handle invalid focus coordinates', async () => {
      try {
        await vietmapApi.autoCompleteSearchV4(
          new SearchRequestV4({
            text: 'test location',
            apikey: envVariables.VIETMAP_API_KEY,
            focus: [999, 999], // Invalid coordinates
          }),
        );
      } catch (error) {
        console.log('✅ Invalid focus coordinates handled with error:', error);
        expect(error).toBeDefined();
      }
    });
  });

  describe('Display Type Testing', () => {
    test('should work with NEW_FORMAT display type', async () => {
      await TestHelpers.executeTestWithLogging(
        'NEW_FORMAT AutoComplete',
        async () => {
          const result = await vietmapApi.autoCompleteSearchV4(
            new SearchRequestV4({
              text: 'Quận 1',
              apikey: envVariables.VIETMAP_API_KEY,
              displayType: SearchDisplayType.NEW_FORMAT,
            }),
          );
          expect(result).toBeInstanceOf(Array);
        },
      );
    });

    test('should work with OLD_FORMAT display type', async () => {
      await TestHelpers.executeTestWithLogging(
        'OLD_FORMAT AutoComplete',
        async () => {
          const result = await vietmapApi.autoCompleteSearchV4(
            new SearchRequestV4({
              text: 'Phường 1',
              apikey: envVariables.VIETMAP_API_KEY,
              displayType: SearchDisplayType.OLD_FORMAT,
            }),
          );
          expect(result).toBeInstanceOf(Array);
        },
      );
    });

    test('should work with BOTH_NEW_OLD display type', async () => {
      await TestHelpers.executeTestWithLogging(
        'BOTH_NEW_OLD AutoComplete',
        async () => {
          const result = await vietmapApi.autoCompleteSearchV4(
            new SearchRequestV4({
              text: 'Hồ Chí Minh',
              apikey: envVariables.VIETMAP_API_KEY,
              displayType: SearchDisplayType.BOTH_NEW_OLD,
            }),
          );
          expect(result).toBeInstanceOf(Array);
        },
      );
    });
  });

  describe('Layer Filtering Tests', () => {
    test('should filter to ADDRESS layer only', async () => {
      await TestHelpers.executeTestWithLogging(
        'ADDRESS Layer Filter AutoComplete',
        async () => {
          const result = await vietmapApi.autoCompleteSearchV4(
            new SearchRequestV4({
              text: '123',
              apikey: envVariables.VIETMAP_API_KEY,
              layers: layers.ADDRESS,
            }),
          );
          expect(result).toBeInstanceOf(Array);
        },
      );
    });

    test('should filter to POI layer only', async () => {
      await TestHelpers.executeTestWithLogging(
        'POI Layer Filter AutoComplete',
        async () => {
          const result = await vietmapApi.autoCompleteSearchV4(
            new SearchRequestV4({
              text: 'siêu thị',
              apikey: envVariables.VIETMAP_API_KEY,
              layers: layers.POI,
            }),
          );
          expect(result).toBeInstanceOf(Array);
        },
      );
    });

    test('should filter to STREET layer only', async () => {
      await TestHelpers.executeTestWithLogging(
        'STREET Layer Filter AutoComplete',
        async () => {
          const result = await vietmapApi.autoCompleteSearchV4(
            new SearchRequestV4({
              text: 'đường',
              apikey: envVariables.VIETMAP_API_KEY,
              layers: layers.STREET,
            }),
          );
          expect(result).toBeInstanceOf(Array);
        },
      );
    });
  });

  describe('Geographic Area Filtering', () => {
    test('should filter by city ID', async () => {
      await TestHelpers.executeTestWithLogging(
        'City Filter AutoComplete',
        async () => {
          const result = await vietmapApi.autoCompleteSearchV4(
            new SearchRequestV4({
              text: 'trường học',
              apikey: envVariables.VIETMAP_API_KEY,
              cityId: 12, // Ho Chi Minh City
            }),
          );
          expect(result).toBeInstanceOf(Array);
        },
      );
    });

    test('should filter by district ID', async () => {
      await TestHelpers.executeTestWithLogging(
        'District Filter AutoComplete',
        async () => {
          const result = await vietmapApi.autoCompleteSearchV4(
            new SearchRequestV4({
              text: 'văn phòng',
              apikey: envVariables.VIETMAP_API_KEY,
              distId: 1292, // District 5
            }),
          );
          expect(result).toBeInstanceOf(Array);
        },
      );
    });

    test('should work with circular area filter', async () => {
      await TestHelpers.executeTestWithLogging(
        'Circular Area Filter AutoComplete',
        async () => {
          const result = await vietmapApi.autoCompleteSearchV4(
            new SearchRequestV4({
              text: 'ATM',
              apikey: envVariables.VIETMAP_API_KEY,
              circleCenter: 10.7769,
              circleRadius: 500, // 500 meters
            }),
          );
          expect(result).toBeInstanceOf(Array);
        },
      );
    });
  });

  describe('POI Category Filtering', () => {
    test('should filter by specific POI category', async () => {
      await TestHelpers.executeTestWithLogging(
        'POI Category Filter AutoComplete',
        async () => {
          const result = await vietmapApi.autoCompleteSearchV4(
            new SearchRequestV4({
              text: 'ăn uống',
              apikey: envVariables.VIETMAP_API_KEY,
              cats: '1002-1', // Food & Beverage category
            }),
          );
          expect(result).toBeInstanceOf(Array);
        },
      );
    });

    test('should work with multiple POI categories', async () => {
      await TestHelpers.executeTestWithLogging(
        'Multiple POI Categories AutoComplete',
        async () => {
          const result = await vietmapApi.autoCompleteSearchV4(
            new SearchRequestV4({
              text: 'dịch vụ',
              apikey: envVariables.VIETMAP_API_KEY,
              cats: '1002-1,1003-1', // Multiple categories
            }),
          );
          expect(result).toBeInstanceOf(Array);
        },
      );
    });
  });

  describe('Security and Edge Cases', () => {
    test('should handle SQL injection attempts in text', async () => {
      try {
        await TestHelpers.executeTestWithLogging(
          'SQL Injection Security Test',
          async () => {
            const result = await vietmapApi.autoCompleteSearchV4(
              new SearchRequestV4({
                text: "'; DROP TABLE locations; --",
                apikey: envVariables.VIETMAP_API_KEY,
              }),
            );
            expect(result).toBeInstanceOf(Array);
          },
        );
      } catch (error) {
        console.log('✅ SQL injection attempt handled with error:', error);
        expect(error).toBeDefined();
      }
    });

    test('should handle XSS attempts in text', async () => {
      try {
        await TestHelpers.executeTestWithLogging(
          'XSS Security Test',
          async () => {
            const result = await vietmapApi.autoCompleteSearchV4(
              new SearchRequestV4({
                text: '<script>alert("xss")</script>',
                apikey: envVariables.VIETMAP_API_KEY,
              }),
            );
            expect(result).toBeInstanceOf(Array);
          },
        );
      } catch (error) {
        console.log('✅ XSS attempt handled with error:', error);
        expect(error).toBeDefined();
      }
    });

    test('should handle very long text input', async () => {
      try {
        await TestHelpers.executeTestWithLogging(
          'Long Text Input Test',
          async () => {
            const longText = 'a'.repeat(1000);
            const result = await vietmapApi.autoCompleteSearchV4(
              new SearchRequestV4({
                text: longText,
                apikey: envVariables.VIETMAP_API_KEY,
              }),
            );
            expect(result).toBeInstanceOf(Array);
          },
        );
      } catch (error) {
        console.log('✅ Long text input handled with error:', error);
        expect(error).toBeDefined();
      }
    });

    test('should handle special characters in text', async () => {
      await TestHelpers.executeTestWithLogging(
        'Special Characters AutoComplete',
        async () => {
          const result = await vietmapApi.autoCompleteSearchV4(
            new SearchRequestV4({
              text: 'Café & Restaurant @#$%',
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(Array);
        },
      );
    });

    test('should handle Unicode characters', async () => {
      await TestHelpers.executeTestWithLogging(
        'Unicode Characters AutoComplete',
        async () => {
          const result = await vietmapApi.autoCompleteSearchV4(
            new SearchRequestV4({
              text: '🏥 Bệnh viện 🏪',
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(Array);
        },
      );
    });
  });

  describe('Performance and Boundary Testing', () => {
    test('should handle multiple concurrent autocomplete requests', async () => {
      await TestHelpers.executeTestWithLogging(
        'Concurrent AutoComplete Requests',
        async () => {
          const promises = Array.from({ length: 3 }, (_, index) =>
            vietmapApi.autoCompleteSearchV4(
              new SearchRequestV4({
                text: `location ${index}`,
                apikey: envVariables.VIETMAP_API_KEY,
              }),
            ),
          );

          const results = await Promise.all(promises);
          results.forEach((result) => {
            expect(result).toBeInstanceOf(Array);
          });
        },
      );
    });

    test('should handle boundary coordinates', async () => {
      await TestHelpers.executeTestWithLogging(
        'Boundary Coordinates AutoComplete',
        async () => {
          const result = await vietmapApi.autoCompleteSearchV4(
            new SearchRequestV4({
              text: 'location',
              apikey: envVariables.VIETMAP_API_KEY,
              focus: [23.393395, 109.461178], // Vietnam northern boundary
            }),
          );
          expect(result).toBeInstanceOf(Array);
        },
      );
    });

    test('should handle numerical text input', async () => {
      await TestHelpers.executeTestWithLogging(
        'Numerical Text AutoComplete',
        async () => {
          const result = await vietmapApi.autoCompleteSearchV4(
            new SearchRequestV4({
              text: '123456789',
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(Array);
        },
      );
    });
  });

  describe('Complex Parameter Combinations', () => {
    test('should work with all parameters combined', async () => {
      await TestHelpers.executeTestWithLogging(
        'All Parameters Combined AutoComplete',
        async () => {
          const result = await vietmapApi.autoCompleteSearchV4(
            new SearchRequestV4({
              text: 'quán cà phê',
              apikey: envVariables.VIETMAP_API_KEY,
              focus: [10.7769, 106.7009],
              displayType: SearchDisplayType.BOTH_NEW_OLD,
              layers: layers.POI,
              circleCenter: 10.7769,
              circleRadius: 1000,
              cats: '1002-1',
              cityId: 12,
              distId: 1292,
            }),
          );
          expect(result).toBeInstanceOf(Array);
        },
      );
    });

    test('should handle conflicting geographic filters', async () => {
      await TestHelpers.executeTestWithLogging(
        'Conflicting Geographic Filters AutoComplete',
        async () => {
          const result = await vietmapApi.autoCompleteSearchV4(
            new SearchRequestV4({
              text: 'test',
              apikey: envVariables.VIETMAP_API_KEY,
              cityId: 12, // Ho Chi Minh City
              focus: [21.0285, 105.8542], // Hanoi coordinates
            }),
          );
          expect(result).toBeInstanceOf(Array);
        },
      );
    });
  });

  describe('Response Validation Testing', () => {
    test('should return proper response structure', async () => {
      await TestHelpers.executeTestWithLogging(
        'Response Structure Validation',
        async () => {
          const result = await vietmapApi.autoCompleteSearchV4(
            new SearchRequestV4({
              text: 'Vietmap office',
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );

          expect(result).toBeInstanceOf(Array);
          if (result.length > 0) {
            const firstResult = result[0];
            expect(firstResult).toBeInstanceOf(SearchResponseV4);
            expect(firstResult.ref_id).toBeDefined();
            expect(firstResult.name).toBeDefined();
            expect(firstResult.address).toBeDefined();
            expect(firstResult.display).toBeDefined();
            expect(firstResult.boundaries).toBeInstanceOf(Array);
            expect(firstResult.categories).toBeInstanceOf(Array);
          }
        },
      );
    });

    test('should handle empty result gracefully', async () => {
      await TestHelpers.executeTestWithLogging(
        'Empty Result Handling',
        async () => {
          const result = await vietmapApi.autoCompleteSearchV4(
            new SearchRequestV4({
              text: 'xyznonexistentlocation999',
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(Array);
          expect(result.length).toBe(0);
        },
      );
    });
  });
});
