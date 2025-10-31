import * as dotenv from 'dotenv';

// Load environment variables for tests
dotenv.config();

// Common test utilities and constants
export const TEST_CONFIG = {
  TIMEOUT: 30000, // 30 seconds timeout for API calls
  RETRY_COUNT: 3,

  // Common test refIds for different scenarios
  VALID_ADDRESS_REFID:
    'vm:ADDRESS:MM03541B04565B050B19510B52021F0407025B165351004C1B06055C045302570356000E51075F0263515A647F182119280B167254591048',
  VALID_POI_REFID: 'vm:POI:123456789ABCDEF',
  AUTO_REFID:
    'auto:RAkPcicmZ3d-NQhac2kADHYlbFAkBiEeAQAkCV0EXwdF_KakgoWOrg0FFWZfh4jFXA1kXfbZFlNRGFUYCAJXAF8BUQBVCAZUC18EA1VMAwUYXwJQBBQFBQVTHVFacANBQlU',
  GEOCODE_REFID:
    'geocode:RAkPcicmZ3d-NQhac2kADHYlbFAkBiEeAQAkCV0EXwdFbESDiMNbEzMK9ogWVwJMBRgNBwdRFFZWBlIdAQZcCVcFUB5TDwNbAlYDClJSBQIdVQk2QFhR',

  // Test coordinates
  HO_CHI_MINH_COORDS: [10.7769, 106.7009] as [number, number],
  HANOI_COORDS: [21.0285, 105.8542] as [number, number],
  DA_NANG_COORDS: [16.0544, 108.2022] as [number, number],
};

// Common test helper functions
export class TestHelpers {
  /**
   * Create a delay for testing rate limits or timing
   */
  static async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Log test results with consistent formatting
   */
  static logTestResult(
    testName: string,
    expected: 'success' | 'error',
    actual: 'success' | 'error',
    data?: any,
  ): void {
    const timestamp = new Date().toISOString();
    const emoji = expected === actual ? '✅' : '⚠️';
    const status = expected === actual ? 'EXPECTED' : 'UNEXPECTED';

    console.log(
      `${emoji} [${timestamp}] ${testName}: ${status} ${actual.toUpperCase()}`,
    );

    if (data) {
      if (actual === 'error') {
        console.log(`   Error details:`, data);
      } else {
        console.log(
          `   Result:`,
          typeof data === 'object' ? JSON.stringify(data, null, 2) : data,
        );
      }
    }
  }

  /**
   * Execute test with standardized error logging
   */
  // static async executeTestWithLogging<T>(
  //   testName: string,
  //   testFn: () => Promise<T>,
  //   expectError: boolean = false,
  // ): Promise<T | Error> {
  //   try {
  //     const result = await testFn();
  //     this.logTestResult(
  //       testName,
  //       expectError ? 'error' : 'success',
  //       'success',
  //       result,
  //     );
  //     return result;
  //   } catch (error) {
  //     this.logTestResult(
  //       testName,
  //       expectError ? 'error' : 'success',
  //       'error',
  //       error,
  //     );
  //     if (!expectError) {
  //       throw error; // Re-throw if we weren't expecting an error
  //     }
  //     return error as Error;
  //   }
  // }

  /**
   * Validate if a string looks like a valid refId
   */
  static isValidRefIdFormat(refId: string): boolean {
    return /^(vm:|auto:|geocode:).+/.test(refId);
  }

  /**
   * Validate if coordinates are within Vietnam bounds (approximate)
   */
  static isValidVietnamCoordinates(lat: number, lng: number): boolean {
    return lat >= 8.0 && lat <= 24.0 && lng >= 102.0 && lng <= 110.0;
  }

  /**
   * Generate test refIds with different patterns
   */
  static generateTestRefIds(): string[] {
    return [
      'vm:ADDRESS:TEST123456789ABCDEF',
      'vm:POI:TEST123456789ABCDEF',
      'auto:TESTREFIDAUTO123456',
      'geocode:TESTREFIDGEOCODE123456',
    ];
  }

  /**
   * Generate malicious test strings for security testing
   */
  static generateMaliciousStrings(): string[] {
    return [
      // SQL Injection patterns
      "'; DROP TABLE places; --",
      "' OR 1=1 --",
      "' UNION SELECT * FROM users --",

      // XSS patterns
      "<script>alert('XSS')</script>",
      "javascript:alert('XSS')",
      "<img src=x onerror=alert('XSS')>",

      // Path traversal
      '../../../etc/passwd',
      '..\\..\\..\\windows\\system32\\config\\sam',

      // Command injection
      '; rm -rf /',
      '| cat /etc/passwd',
      '&& del /f /q C:\\*.*',

      // Buffer overflow attempts
      'A'.repeat(10000),

      // Unicode/encoding attacks
      '%00', // Null byte
      '%2e%2e%2f', // ../
      '\u0000', // Unicode null
      '\uff1c\uff1e', // Unicode < >
    ];
  }
}

// Common validation patterns
export const VALIDATION_PATTERNS = {
  REFID_PREFIXES: ['vm:', 'auto:', 'geocode:'],
  VIETNAM_BOUNDS: {
    LAT_MIN: 8.0,
    LAT_MAX: 24.0,
    LNG_MIN: 102.0,
    LNG_MAX: 110.0,
  },
};

// Export environment validation
export function validateTestEnvironment(): void {
  if (!process.env.VIETMAP_API_KEY) {
    throw new Error(
      'VIETMAP_API_KEY environment variable is required for tests',
    );
  }
}
