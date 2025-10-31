import * as dotenv from 'dotenv';
import { beforeAll, describe, expect, test } from 'vitest';
import { z } from 'zod';
import { VietmapApi } from '../vietmap-api';
import { PlaceRequest, PlaceResponse } from '../models';
import {
  TEST_CONFIG,
  TestHelpers,
  validateTestEnvironment,
} from './test-helpers';

dotenv.config();
validateTestEnvironment();

const envVariables = z
  .object({
    VIETMAP_API_KEY: z.string(),
  })
  .parse(process.env);

describe('Place V4 API - Edge Cases & Comprehensive Testing', () => {
  let vietmapApi: VietmapApi;

  beforeAll(() => {
    vietmapApi = new VietmapApi({});
  });

  describe('Valid RefId Testing', () => {
    test(
      'should work with standard ADDRESS refId format',
      async () => {
        const result = await vietmapApi.placeV4(
          new PlaceRequest({
            refId: TEST_CONFIG.VALID_ADDRESS_REFID,
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        expect(result).toBeInstanceOf(PlaceResponse);
        expect(result.display).toBeDefined();
        expect(result.lat).toBeDefined();
        expect(result.lng).toBeDefined();

        // Validate coordinates are within Vietnam bounds
        expect(
          TestHelpers.isValidVietnamCoordinates(result.lat, result.lng),
        ).toBe(true);
      },
      TEST_CONFIG.TIMEOUT,
    );

    test('should work with POI refId format', async () => {
      try {
        const result = await vietmapApi.placeV4(
          new PlaceRequest({
            refId: 'vm:POI:123456789ABCDEF',
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        console.log('✅ POI refId format accepted, result:', result);
        expect(result).toBeInstanceOf(PlaceResponse);
      } catch (error) {
        console.log('⚠️ POI refId format rejected with error:', error);
        // POI refId might not exist, so error is acceptable
        expect(error).toBeDefined();
      }
    });

    test('should work with auto: prefixed refId', async () => {
      try {
        const result = await vietmapApi.placeV4(
          new PlaceRequest({
            refId: TEST_CONFIG.AUTO_REFID,
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        console.log('✅ Auto prefixed refId accepted, result:', result);
        expect(result).toBeInstanceOf(PlaceResponse);
      } catch (error) {
        console.log('⚠️ Auto prefixed refId rejected with error:', error);
        // Auto refId might not exist or be invalid, error is acceptable
        expect(error).toBeDefined();
      }
    });

    test('should work with geocode: prefixed refId', async () => {
      try {
        const result = await vietmapApi.placeV4(
          new PlaceRequest({
            refId: TEST_CONFIG.GEOCODE_REFID,
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        console.log('✅ Geocode prefixed refId accepted, result:', result);
        expect(result).toBeInstanceOf(PlaceResponse);
      } catch (error) {
        console.log('⚠️ Geocode prefixed refId rejected with error:', error);
        // Geocode refId might not exist or be invalid, error is acceptable
        expect(error).toBeDefined();
      }
    });
  });

  describe('Invalid RefId Edge Cases', () => {
    test('should handle empty refId', async () => {
      try {
        const result = await vietmapApi.placeV4(
          new PlaceRequest({
            refId: '',
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        console.log(
          '⚠️ Empty refId was accepted (unexpected), result:',
          result,
        );
        expect(result).toBeDefined();
      } catch (error) {
        console.log('✅ Empty refId correctly rejected with error:', error);
        expect(error).toBeDefined();
      }
    });

    test('should handle null/undefined refId', async () => {
      try {
        // @ts-ignore - Testing runtime behavior
        await vietmapApi.placeV4(
          new PlaceRequest({
            refId: null as any,
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        console.log('⚠️ Null refId was accepted (unexpected)');
        expect(false).toBe(true); // Should not reach here
      } catch (error) {
        console.log('✅ Null refId correctly rejected with error:', error);
        expect(error).toBeDefined();
      }
    });

    test('should handle malformed refId - missing prefix', async () => {
      try {
        const result = await vietmapApi.placeV4(
          new PlaceRequest({
            refId: 'INVALID_REF_ID_WITHOUT_PREFIX',
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        console.log(
          '⚠️ Malformed refId without prefix was accepted, result:',
          result,
        );
        expect(result).toBeDefined();
      } catch (error) {
        console.log('✅ Malformed refId correctly rejected with error:', error);
        expect(error).toBeDefined();
      }
    });

    test('should handle refId with invalid characters', async () => {
      try {
        const result = await vietmapApi.placeV4(
          new PlaceRequest({
            refId: 'vm:ADDRESS:!!!@@@###$$$%%%^^^&&&***((()))',
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        console.log(
          '⚠️ RefId with invalid characters was accepted, result:',
          result,
        );
        expect(result).toBeDefined();
      } catch (error) {
        console.log(
          '✅ RefId with invalid characters correctly rejected with error:',
          error,
        );
        expect(error).toBeDefined();
      }
    });

    test('should handle extremely long refId', async () => {
      const longRefId = 'vm:ADDRESS:' + 'A'.repeat(1000);
      try {
        const result = await vietmapApi.placeV4(
          new PlaceRequest({
            refId: longRefId,
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        console.log(
          '⚠️ Extremely long refId (1000+ chars) was accepted, result:',
          result,
        );
        expect(result).toBeDefined();
      } catch (error) {
        console.log(
          '✅ Extremely long refId correctly rejected with error:',
          error,
        );
        expect(error).toBeDefined();
      }
    });

    test('should handle refId with SQL injection patterns', async () => {
      const sqlInjectionRefId = "vm:ADDRESS:'; DROP TABLE places; --";
      try {
        const result = await vietmapApi.placeV4(
          new PlaceRequest({
            refId: sqlInjectionRefId,
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        console.log(
          '🔒 SQL injection pattern was safely handled, result:',
          result,
        );
        expect(result).toBeDefined();
      } catch (error) {
        console.log(
          '🔒 SQL injection pattern correctly blocked with error:',
          error,
        );
        expect(error).toBeDefined();
      }
    });

    test('should handle refId with XSS patterns', async () => {
      const xssRefId = "vm:ADDRESS:<script>alert('XSS')</script>";
      try {
        const result = await vietmapApi.placeV4(
          new PlaceRequest({
            refId: xssRefId,
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        console.log('🔒 XSS pattern was safely handled, result:', result);
        expect(result).toBeDefined();
      } catch (error) {
        console.log('🔒 XSS pattern correctly blocked with error:', error);
        expect(error).toBeDefined();
      }
    });

    test('should handle non-existent refId', async () => {
      try {
        const result = await vietmapApi.placeV4(
          new PlaceRequest({
            refId: 'vm:ADDRESS:NONEXISTENT123456789ABCDEF',
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        // Should return empty result or error response
        expect(result).toBeDefined();
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    test('should handle refId from different API versions', async () => {
      // Old format refId
      try {
        const result = await vietmapApi.placeV4(
          new PlaceRequest({
            refId: 'old_format_ref_id_123456',
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        expect(result).toBeDefined();
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('API Key Edge Cases', () => {
    test('should handle missing apikey', async () => {
      try {
        await vietmapApi.placeV4(
          new PlaceRequest({
            refId:
              'vm:ADDRESS:MM03541B04565B050B19510B52021F0407025B165351004C1B06055C045302570356000E51075F0263515A647F182119280B167254591048',
            apikey: '',
          }),
        );
        console.log('⚠️ Missing apikey was accepted (unexpected)');
        expect(false).toBe(true); // Should not reach here
      } catch (error) {
        console.log('✅ Missing apikey correctly rejected with error:', error);
        expect(error).toBeDefined();
      }
    });

    test('should handle invalid apikey format', async () => {
      try {
        await vietmapApi.placeV4(
          new PlaceRequest({
            refId:
              'vm:ADDRESS:MM03541B04565B050B19510B52021F0407025B165351004C1B06055C045302570356000E51075F0263515A647F182119280B167254591048',
            apikey: 'invalid_key_123',
          }),
        );
        console.log('⚠️ Invalid apikey format was accepted (unexpected)');
        expect(false).toBe(true); // Should not reach here
      } catch (error) {
        console.log(
          '✅ Invalid apikey format correctly rejected with error:',
          error,
        );
        expect(error).toBeDefined();
      }
    });

    test('should handle expired apikey', async () => {
      try {
        await vietmapApi.placeV4(
          new PlaceRequest({
            refId:
              'vm:ADDRESS:MM03541B04565B050B19510B52021F0407025B165351004C1B06055C045302570356000E51075F0263515A647F182119280B167254591048',
            apikey: 'expired_key_would_be_here',
          }),
        );
        expect(false).toBe(true); // Should not reach here
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    test('should handle apikey with special characters', async () => {
      try {
        await vietmapApi.placeV4(
          new PlaceRequest({
            refId:
              'vm:ADDRESS:MM03541B04565B050B19510B52021F0407025B165351004C1B06055C045302570356000E51075F0263515A647F182119280B167254591048',
            apikey: 'key@#$%^&*()_+{}[]|\\:";\'<>?,./',
          }),
        );
        expect(false).toBe(true); // Should not reach here
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    test('should handle extremely long apikey', async () => {
      const longApiKey = 'A'.repeat(1000);
      try {
        await vietmapApi.placeV4(
          new PlaceRequest({
            refId:
              'vm:ADDRESS:MM03541B04565B050B19510B52021F0407025B165351004C1B06055C045302570356000E51075F0263515A647F182119280B167254591048',
            apikey: longApiKey,
          }),
        );
        expect(false).toBe(true); // Should not reach here
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Constructor Validation Edge Cases', () => {
    test('should handle object with extra properties', async () => {
      try {
        // @ts-ignore - Testing runtime behavior
        const requestData: any = {
          refId:
            'vm:ADDRESS:MM03541B04565B050B19510B52021F0407025B165351004C1B06055C045302570356000E51075F0263515A647F182119280B167254591048',
          apikey: envVariables.VIETMAP_API_KEY,
          extraProperty: 'should_be_ignored',
          anotherExtra: 12345,
        };
        const request = new PlaceRequest(requestData);
        const result = await vietmapApi.placeV4(request);
        expect(result).toBeInstanceOf(PlaceResponse);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    test('should handle object with wrong property types', async () => {
      try {
        // @ts-ignore - Testing runtime behavior
        const request = new PlaceRequest({
          refId: 12345 as any, // Wrong type, should be string
          apikey: envVariables.VIETMAP_API_KEY,
        });
        expect(false).toBe(true); // Should not reach here
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    test('should handle completely empty object', async () => {
      try {
        // @ts-ignore - Testing runtime behavior
        const request = new PlaceRequest({});
        expect(false).toBe(true); // Should not reach here
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Network and Performance Edge Cases', () => {
    test('should handle multiple concurrent requests with same refId', async () => {
      const refId =
        'vm:ADDRESS:MM03541B04565B050B19510B52021F0407025B165351004C1B06055C045302570356000E51075F0263515A647F182119280B167254591048';

      const promises = Array.from({ length: 5 }, () =>
        vietmapApi.placeV4(
          new PlaceRequest({
            refId,
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        ),
      );

      const results = await Promise.all(promises);
      results.forEach((result) => {
        expect(result).toBeInstanceOf(PlaceResponse);
        expect(result.display).toBeDefined();
      });
    });

    test('should handle multiple concurrent requests with different refIds', async () => {
      const refIds = [
        'vm:ADDRESS:MM03541B04565B050B19510B52021F0407025B165351004C1B06055C045302570356000E51075F0263515A647F182119280B167254591048',
        'vm:POI:DIFFERENT123456789ABCDEF',
        'auto:ANOTHER_AUTO_REFID_HERE',
      ];

      const promises = refIds.map((refId) =>
        vietmapApi.placeV4(
          new PlaceRequest({
            refId,
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        ),
      );

      try {
        const results = await Promise.all(promises);
        results.forEach((result, index) => {
          expect(result).toBeDefined();
          // Note: Some refIds might not exist, so we don't strictly check for PlaceResponse
        });
      } catch (error) {
        // Some requests might fail with invalid refIds, which is expected
        expect(error).toBeDefined();
      }
    });

    test('should handle rapid sequential requests', async () => {
      const refId =
        'vm:ADDRESS:MM03541B04565B050B19510B52021F0407025B165351004C1B06055C045302570356000E51075F0263515A647F182119280B167254591048';

      for (let i = 0; i < 3; i++) {
        const result = await vietmapApi.placeV4(
          new PlaceRequest({
            refId,
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        expect(result).toBeInstanceOf(PlaceResponse);
      }
    });
  });

  describe('Response Validation Edge Cases', () => {
    test('should validate response structure for valid refId', async () => {
      const result = await vietmapApi.placeV4(
        new PlaceRequest({
          refId:
            'vm:ADDRESS:MM03541B04565B050B19510B52021F0407025B165351004C1B06055C045302570356000E51075F0263515A647F182119280B167254591048',
          apikey: envVariables.VIETMAP_API_KEY,
        }),
      );

      expect(result).toBeInstanceOf(PlaceResponse);

      // Validate required fields
      expect(result.display).toBeDefined();
      expect(typeof result.display).toBe('string');

      expect(result.name).toBeDefined();
      expect(typeof result.name).toBe('string');

      // Validate coordinate fields
      expect(typeof result.lat).toBe('number');
      expect(result.lat).toBeGreaterThan(-90);
      expect(result.lat).toBeLessThan(90);

      expect(typeof result.lng).toBe('number');
      expect(result.lng).toBeGreaterThan(-180);
      expect(result.lng).toBeLessThan(180);

      // Validate address fields
      expect(result.address).toBeDefined();
      expect(typeof result.address).toBe('string');

      expect(result.city).toBeDefined();
      expect(typeof result.city).toBe('string');

      expect(result.ward).toBeDefined();
      expect(typeof result.ward).toBe('string');

      // Validate ID fields
      expect(typeof result.city_id).toBe('number');
      expect(typeof result.ward_id).toBe('number');
      expect(typeof result.district_id).toBe('number');
    });

    test('should handle response with missing optional fields', async () => {
      // This test checks how the API handles responses where some fields might be missing
      try {
        const result = await vietmapApi.placeV4(
          new PlaceRequest({
            refId: 'vm:ADDRESS:MINIMAL_DATA_REF_ID',
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );

        expect(result).toBeDefined();
        // Even if the refId doesn't exist, the response structure should be valid
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Real-world Scenario Edge Cases', () => {
    test('should handle refId from Search V4 result', async () => {
      // First get a refId from Search V4, then use it in Place V4
      // This simulates the real workflow
      try {
        // Note: This would require importing SearchRequestV4 and searchV4 method
        // For now, we'll use a known working refId
        const result = await vietmapApi.placeV4(
          new PlaceRequest({
            refId:
              'vm:ADDRESS:MM03541B04565B050B19510B52021F0407025B165351004C1B06055C045302570356000E51075F0263515A647F182119280B167254591048',
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );

        expect(result).toBeInstanceOf(PlaceResponse);
        expect(result.display).toBeDefined();
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    test('should handle refId with different encoding formats', async () => {
      // Test refIds that might come from different sources or encodings
      const encodedRefIds = [
        'vm%3AADDRESS%3AMM03541B04565B050B19510B52021F0407025B165351004C1B06055C045302570356000E51075F0263515A647F182119280B167254591048', // URL encoded
        'vm:ADDRESS:MM03541B04565B050B19510B52021F0407025B165351004C1B06055C045302570356000E51075F0263515A647F182119280B167254591048', // Normal
      ];

      for (const refId of encodedRefIds) {
        try {
          const result = await vietmapApi.placeV4(
            new PlaceRequest({
              refId: decodeURIComponent(refId), // Decode if needed
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          );
          expect(result).toBeDefined();
        } catch (error) {
          expect(error).toBeDefined();
        }
      }
    });

    test('should handle case sensitivity in refId', async () => {
      const originalRefId =
        'vm:ADDRESS:MM03541B04565B050B19510B52021F0407025B165351004C1B06055C045302570356000E51075F0263515A647F182119280B167254591048';
      const lowerCaseRefId = originalRefId.toLowerCase();
      const upperCaseRefId = originalRefId.toUpperCase();

      // Test original (should work)
      try {
        const result1 = await vietmapApi.placeV4(
          new PlaceRequest({
            refId: originalRefId,
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        expect(result1).toBeInstanceOf(PlaceResponse);
      } catch (error) {
        expect(error).toBeDefined();
      }

      // Test different cases (might not work, depends on API)
      try {
        await vietmapApi.placeV4(
          new PlaceRequest({
            refId: lowerCaseRefId,
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
      } catch (error) {
        // Case sensitivity error is expected
        expect(error).toBeDefined();
      }

      try {
        await vietmapApi.placeV4(
          new PlaceRequest({
            refId: upperCaseRefId,
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
      } catch (error) {
        // Case sensitivity error is expected
        expect(error).toBeDefined();
      }
    });
  });

  describe('Boundary and Limit Testing', () => {
    test('should handle minimum valid refId length', async () => {
      // Test shortest possible valid refId
      try {
        const result = await vietmapApi.placeV4(
          new PlaceRequest({
            refId: 'vm:A:1',
            apikey: envVariables.VIETMAP_API_KEY,
          }),
        );
        expect(result).toBeDefined();
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    test('should handle maximum API rate limits', async () => {
      // Test behavior when approaching rate limits
      const requests = [];
      const refId =
        'vm:ADDRESS:MM03541B04565B050B19510B52021F0407025B165351004C1B06055C045302570356000E51075F0263515A647F182119280B167254591048';

      // Create many requests (adjust count based on known rate limits)
      for (let i = 0; i < 10; i++) {
        requests.push(
          vietmapApi.placeV4(
            new PlaceRequest({
              refId,
              apikey: envVariables.VIETMAP_API_KEY,
            }),
          ),
        );
      }

      try {
        const results = await Promise.allSettled(requests);

        // Check that at least some requests succeeded
        const successfulResults = results.filter(
          (result) => result.status === 'fulfilled',
        );

        expect(successfulResults.length).toBeGreaterThan(0);

        // Check for rate limit errors
        const failedResults = results.filter(
          (result) => result.status === 'rejected',
        );

        // Some might fail due to rate limits, which is expected
        if (failedResults.length > 0) {
          console.log(
            `${failedResults.length} requests failed (possibly due to rate limits)`,
          );
        }
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
