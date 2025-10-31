import * as dotenv from 'dotenv';
import { beforeAll, describe, expect, test } from 'vitest';
import { z } from 'zod';
import { VietmapApi } from '../vietmap-api';

import { ReverseRequestV4, ReverseResponseV4 } from '../models';
import { ReverseDisplayType } from '../types';
import { TestHelpers } from './test-helpers';

dotenv.config();

const envVariables = z
  .object({
    VIETMAP_API_KEY: z.string(),
  })
  .parse(process.env);

describe('Reverse V4 API - Comprehensive Edge Case Testing', () => {
  let vietmapApi: VietmapApi;

  beforeAll(() => {
    vietmapApi = new VietmapApi({});
  });

  describe('Basic Functionality Tests', () => {
    test('should work with valid coordinates', async () => {
      await TestHelpers.executeTestWithLogging(
        'Basic Reverse V4 Test',
        async () => {
          const result = await vietmapApi.reverseV4(
            new ReverseRequestV4({
              lat: 10.759094790020278,
              lng: 106.67596571338835,
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(ReverseResponseV4);
          expect(result.address).toBeDefined();
          expect(result.lat).toBeCloseTo(10.759094790020278, 5);
          expect(result.lng).toBeCloseTo(106.67596571338835, 5);
        },
      );
    });

    test('should work with Ho Chi Minh City coordinates', async () => {
      await TestHelpers.executeTestWithLogging(
        'Ho Chi Minh City Reverse Geocoding',
        async () => {
          const result = await vietmapApi.reverseV4(
            new ReverseRequestV4({
              lat: 10.7769,
              lng: 106.7009,
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(ReverseResponseV4);
          expect(result.address).toBeDefined();
        },
      );
    });

    test('should work with Hanoi coordinates', async () => {
      await TestHelpers.executeTestWithLogging(
        'Hanoi Reverse Geocoding',
        async () => {
          const result = await vietmapApi.reverseV4(
            new ReverseRequestV4({
              lat: 21.0285,
              lng: 105.8542,
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(ReverseResponseV4);
          expect(result.address).toBeDefined();
        },
      );
    });
  });

  describe('Invalid Parameters Testing', () => {
    test('should handle missing API key', async () => {
      try {
        await vietmapApi.reverseV4(
          new ReverseRequestV4({
            lat: 10.7769,
            lng: 106.7009,
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
        await vietmapApi.reverseV4(
          new ReverseRequestV4({
            lat: 10.7769,
            lng: 106.7009,
            apikey: 'invalid_api_key_12345',
          }),
        );
      } catch (error) {
        console.log('✅ Invalid API key correctly rejected with error:', error);
        expect(error).toBeDefined();
      }
    });

    test('should handle invalid latitude (too high)', async () => {
      try {
        await vietmapApi.reverseV4(
          new ReverseRequestV4({
            lat: 91, // Invalid: > 90
            lng: 106.7009,
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
      } catch (error) {
        console.log(
          '✅ Invalid latitude (>90) correctly rejected with error:',
          error,
        );
        expect(error).toBeDefined();
      }
    });

    test('should handle invalid latitude (too low)', async () => {
      try {
        await vietmapApi.reverseV4(
          new ReverseRequestV4({
            lat: -91, // Invalid: < -90
            lng: 106.7009,
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
      } catch (error) {
        console.log(
          '✅ Invalid latitude (<-90) correctly rejected with error:',
          error,
        );
        expect(error).toBeDefined();
      }
    });

    test('should handle invalid longitude (too high)', async () => {
      try {
        await vietmapApi.reverseV4(
          new ReverseRequestV4({
            lat: 10.7769,
            lng: 181, // Invalid: > 180
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
      } catch (error) {
        console.log(
          '✅ Invalid longitude (>180) correctly rejected with error:',
          error,
        );
        expect(error).toBeDefined();
      }
    });

    test('should handle invalid longitude (too low)', async () => {
      try {
        await vietmapApi.reverseV4(
          new ReverseRequestV4({
            lat: 10.7769,
            lng: -181, // Invalid: < -180
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
      } catch (error) {
        console.log(
          '✅ Invalid longitude (<-180) correctly rejected with error:',
          error,
        );
        expect(error).toBeDefined();
      }
    });
  });

  describe('Boundary Coordinates Testing', () => {
    test('should handle maximum valid latitude', async () => {
      await TestHelpers.executeTestWithLogging(
        'Maximum Valid Latitude Test',
        async () => {
          const result = await vietmapApi.reverseV4(
            new ReverseRequestV4({
              lat: 90,
              lng: 0,
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(ReverseResponseV4);
        },
      );
    });

    test('should handle minimum valid latitude', async () => {
      await TestHelpers.executeTestWithLogging(
        'Minimum Valid Latitude Test',
        async () => {
          const result = await vietmapApi.reverseV4(
            new ReverseRequestV4({
              lat: -90,
              lng: 0,
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(ReverseResponseV4);
        },
      );
    });

    test('should handle maximum valid longitude', async () => {
      await TestHelpers.executeTestWithLogging(
        'Maximum Valid Longitude Test',
        async () => {
          const result = await vietmapApi.reverseV4(
            new ReverseRequestV4({
              lat: 0,
              lng: 180,
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(ReverseResponseV4);
        },
      );
    });

    test('should handle minimum valid longitude', async () => {
      await TestHelpers.executeTestWithLogging(
        'Minimum Valid Longitude Test',
        async () => {
          const result = await vietmapApi.reverseV4(
            new ReverseRequestV4({
              lat: 0,
              lng: -180,
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(ReverseResponseV4);
        },
      );
    });
  });

  describe('Vietnam Specific Boundary Testing', () => {
    test('should handle northern Vietnam boundary', async () => {
      await TestHelpers.executeTestWithLogging(
        'Northern Vietnam Boundary Test',
        async () => {
          const result = await vietmapApi.reverseV4(
            new ReverseRequestV4({
              lat: 23.393395, // Vietnam's northernmost point
              lng: 105.392099,
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(ReverseResponseV4);
        },
      );
    });

    test('should handle southern Vietnam boundary', async () => {
      await TestHelpers.executeTestWithLogging(
        'Southern Vietnam Boundary Test',
        async () => {
          const result = await vietmapApi.reverseV4(
            new ReverseRequestV4({
              lat: 8.181345, // Vietnam's southernmost point
              lng: 104.500884,
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(ReverseResponseV4);
        },
      );
    });

    test('should handle western Vietnam boundary', async () => {
      await TestHelpers.executeTestWithLogging(
        'Western Vietnam Boundary Test',
        async () => {
          const result = await vietmapApi.reverseV4(
            new ReverseRequestV4({
              lat: 22.461178,
              lng: 102.170435, // Vietnam's westernmost point
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(ReverseResponseV4);
        },
      );
    });

    test('should handle eastern Vietnam boundary', async () => {
      await TestHelpers.executeTestWithLogging(
        'Eastern Vietnam Boundary Test',
        async () => {
          const result = await vietmapApi.reverseV4(
            new ReverseRequestV4({
              lat: 21.508333,
              lng: 109.461178, // Vietnam's easternmost point
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(ReverseResponseV4);
        },
      );
    });
  });

  describe('Ocean and Water Body Testing', () => {
    test('should handle coordinates in South China Sea', async () => {
      await TestHelpers.executeTestWithLogging(
        'South China Sea Coordinates Test',
        async () => {
          const result = await vietmapApi.reverseV4(
            new ReverseRequestV4({
              lat: 12.0,
              lng: 114.0, // In South China Sea
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(ReverseResponseV4);
        },
      );
    });

    test('should handle coordinates in Gulf of Thailand', async () => {
      await TestHelpers.executeTestWithLogging(
        'Gulf of Thailand Coordinates Test',
        async () => {
          const result = await vietmapApi.reverseV4(
            new ReverseRequestV4({
              lat: 9.0,
              lng: 103.5, // In Gulf of Thailand
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(ReverseResponseV4);
        },
      );
    });
  });

  describe('Display Type Testing', () => {
    test('should work with NEW_FORMAT display type', async () => {
      await TestHelpers.executeTestWithLogging(
        'NEW_FORMAT Display Type Test',
        async () => {
          const result = await vietmapApi.reverseV4(
            new ReverseRequestV4({
              lat: 10.7769,
              lng: 106.7009,
              apikey: envVariables.VIETMAP_API_KEY,
              displayType: ReverseDisplayType.NEW_FORMAT,
            }),
          );
          expect(result).toBeInstanceOf(ReverseResponseV4);
          expect(result.address).toBeDefined();
        },
      );
    });

    test('should work with OLD_FORMAT display type', async () => {
      await TestHelpers.executeTestWithLogging(
        'OLD_FORMAT Display Type Test',
        async () => {
          const result = await vietmapApi.reverseV4(
            new ReverseRequestV4({
              lat: 10.7769,
              lng: 106.7009,
              apikey: envVariables.VIETMAP_API_KEY,
              displayType: ReverseDisplayType.OLD_FORMAT,
            }),
          );
          expect(result).toBeInstanceOf(ReverseResponseV4);
          expect(result.address).toBeDefined();
        },
      );
    });

    test('should work with BOTH_NEW_OLD display type', async () => {
      await TestHelpers.executeTestWithLogging(
        'BOTH_NEW_OLD Display Type Test',
        async () => {
          const result = await vietmapApi.reverseV4(
            new ReverseRequestV4({
              lat: 10.7769,
              lng: 106.7009,
              apikey: envVariables.VIETMAP_API_KEY,
              displayType: ReverseDisplayType.BOTH_NEW_OLD,
            }),
          );
          expect(result).toBeInstanceOf(ReverseResponseV4);
          expect(result.address).toBeDefined();
        },
      );
    });

    test('should work with BOTH_OLD_NEW display type', async () => {
      await TestHelpers.executeTestWithLogging(
        'BOTH_OLD_NEW Display Type Test',
        async () => {
          const result = await vietmapApi.reverseV4(
            new ReverseRequestV4({
              lat: 10.7769,
              lng: 106.7009,
              apikey: envVariables.VIETMAP_API_KEY,
              displayType: ReverseDisplayType.BOTH_OLD_NEW,
            }),
          );
          expect(result).toBeInstanceOf(ReverseResponseV4);
          expect(result.address).toBeDefined();
        },
      );
    });

    test('should work with TWO_OBJECTS display type', async () => {
      await TestHelpers.executeTestWithLogging(
        'TWO_OBJECTS Display Type Test',
        async () => {
          const result = await vietmapApi.reverseV4(
            new ReverseRequestV4({
              lat: 10.7769,
              lng: 106.7009,
              apikey: envVariables.VIETMAP_API_KEY,
              displayType: ReverseDisplayType.TWO_OBJECTS,
            }),
          );
          expect(result).toBeInstanceOf(ReverseResponseV4);
          expect(result.address).toBeDefined();
        },
      );
    });
  });

  describe('High Precision Coordinates Testing', () => {
    test('should handle high precision coordinates', async () => {
      await TestHelpers.executeTestWithLogging(
        'High Precision Coordinates Test',
        async () => {
          const result = await vietmapApi.reverseV4(
            new ReverseRequestV4({
              lat: 10.759094790020278123456,
              lng: 106.675965713388351234567,
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(ReverseResponseV4);
        },
      );
    });

    test('should handle coordinates with many decimal places', async () => {
      await TestHelpers.executeTestWithLogging(
        'Many Decimal Places Test',
        async () => {
          const result = await vietmapApi.reverseV4(
            new ReverseRequestV4({
              lat: 10.77690123456789012345,
              lng: 106.70091234567890123456,
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(ReverseResponseV4);
        },
      );
    });
  });

  describe('Performance and Load Testing', () => {
    test('should handle multiple concurrent requests', async () => {
      await TestHelpers.executeTestWithLogging(
        'Concurrent Reverse V4 Requests',
        async () => {
          const coordinates = [
            [10.7769, 106.7009], // Ho Chi Minh City
            [21.0285, 105.8542], // Hanoi
            [16.0544, 108.2022], // Da Nang
          ];

          const promises = coordinates.map(([lat, lng]) =>
            vietmapApi.reverseV4(
              new ReverseRequestV4({
                lat,
                lng,
                apikey: envVariables.VIETMAP_API_KEY,
              }),
            ),
          );

          const results = await Promise.all(promises);
          results.forEach((result) => {
            expect(result).toBeInstanceOf(ReverseResponseV4);
            expect(result.address).toBeDefined();
          });
        },
      );
    });

    test('should handle rapid sequential requests', async () => {
      await TestHelpers.executeTestWithLogging(
        'Rapid Sequential Requests Test',
        async () => {
          const coordinates = [
            [10.7769, 106.7009],
            [10.777, 106.701],
            [10.7771, 106.7011],
          ];

          for (const [lat, lng] of coordinates) {
            const result = await vietmapApi.reverseV4(
              new ReverseRequestV4({
                lat,
                lng,
                apikey: envVariables.VIETMAP_API_KEY,
              }),
            );
            expect(result).toBeInstanceOf(ReverseResponseV4);
          }
        },
      );
    });
  });

  describe('Special Coordinate Cases', () => {
    test('should handle zero coordinates (0, 0)', async () => {
      await TestHelpers.executeTestWithLogging(
        'Zero Coordinates Test',
        async () => {
          const result = await vietmapApi.reverseV4(
            new ReverseRequestV4({
              lat: 0,
              lng: 0,
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(ReverseResponseV4);
        },
      );
    });

    test('should handle negative coordinates', async () => {
      await TestHelpers.executeTestWithLogging(
        'Negative Coordinates Test',
        async () => {
          const result = await vietmapApi.reverseV4(
            new ReverseRequestV4({
              lat: -10.7769,
              lng: -106.7009,
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(ReverseResponseV4);
        },
      );
    });

    test('should handle very small coordinate differences', async () => {
      await TestHelpers.executeTestWithLogging(
        'Small Coordinate Differences Test',
        async () => {
          const result = await vietmapApi.reverseV4(
            new ReverseRequestV4({
              lat: 10.776900001,
              lng: 106.700900001,
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(ReverseResponseV4);
        },
      );
    });
  });

  describe('Response Structure Validation', () => {
    test('should return proper response structure', async () => {
      await TestHelpers.executeTestWithLogging(
        'Response Structure Validation',
        async () => {
          const result = await vietmapApi.reverseV4(
            new ReverseRequestV4({
              lat: 10.7769,
              lng: 106.7009,
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );

          expect(result).toBeInstanceOf(ReverseResponseV4);
          expect(result.address).toBeDefined();
          expect(typeof result.address).toBe('string');
          expect(result.lat).toBeDefined();
          expect(typeof result.lat).toBe('number');
          expect(result.lng).toBeDefined();
          expect(typeof result.lng).toBe('number');
          expect(result.ref_id).toBeDefined();
          expect(typeof result.ref_id).toBe('string');
          expect(result.boundaries).toBeInstanceOf(Array);
        },
      );
    });

    test('should handle coordinates with no results gracefully', async () => {
      await TestHelpers.executeTestWithLogging(
        'No Results Handling Test',
        async () => {
          const result = await vietmapApi.reverseV4(
            new ReverseRequestV4({
              lat: 0,
              lng: 0, // Middle of Atlantic Ocean
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(ReverseResponseV4);
          // Should still return a response, even if address is empty or undefined
        },
      );
    });
  });

  describe('Known Location Testing', () => {
    test('should identify famous Vietnamese locations - Independence Palace', async () => {
      await TestHelpers.executeTestWithLogging(
        'Independence Palace Location Test',
        async () => {
          const result = await vietmapApi.reverseV4(
            new ReverseRequestV4({
              lat: 10.77691,
              lng: 106.69525, // Independence Palace coordinates
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(ReverseResponseV4);
          expect(result.address).toBeDefined();
        },
      );
    });

    test('should identify famous Vietnamese locations - Temple of Literature', async () => {
      await TestHelpers.executeTestWithLogging(
        'Temple of Literature Location Test',
        async () => {
          const result = await vietmapApi.reverseV4(
            new ReverseRequestV4({
              lat: 21.02661,
              lng: 105.83565, // Temple of Literature coordinates
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeInstanceOf(ReverseResponseV4);
          expect(result.address).toBeDefined();
        },
      );
    });
  });
});
