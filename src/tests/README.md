# Vietmap API Test Suite

This directory contains comprehensive test suites for all Vietmap API endpoints with focus on edge cases and real-world scenarios.

## 📁 Test Structure

```
src/tests/
├── test-helpers.ts          # Common utilities and test configuration
├── place-v4-api.test.ts     # Place V4 API comprehensive tests
├── search-v4-api.test.ts    # Search V4 API comprehensive tests (planned)
├── reverse-v4-api.test.ts   # Reverse V4 API comprehensive tests (planned)
├── autocomplete-v4-api.test.ts # AutoComplete V4 API tests (planned)
└── README.md               # This file
```

## 🧪 Test Categories

Each API test file contains the following test categories:

### 1. **Valid Input Testing**

- Standard use cases with valid parameters
- Different format variations
- Boundary value testing

### 2. **Invalid Input Edge Cases**

- Empty/null/undefined parameters
- Malformed data formats
- Invalid characters and special symbols
- Extremely long inputs
- Wrong data types

### 3. **Security Testing**

- SQL injection patterns
- XSS attack vectors
- Path traversal attempts
- Command injection tests
- Buffer overflow scenarios

### 4. **API Key Edge Cases**

- Missing API keys
- Invalid API key formats
- Expired API keys
- Special characters in API keys

### 5. **Constructor Validation**

- Extra properties handling
- Wrong property types
- Missing required fields

### 6. **Network and Performance**

- Concurrent requests
- Rate limiting behavior
- Sequential rapid requests
- Timeout handling

### 7. **Response Validation**

- Response structure validation
- Data type checking
- Coordinate validation
- Missing field handling

### 8. **Real-world Scenarios**

- Integration workflows
- Different encoding formats
- Case sensitivity testing
- Cross-API data flow

### 9. **Boundary and Limit Testing**

- Minimum/maximum valid inputs
- Rate limit testing
- Resource limit testing

## 🔧 Environment Setup

Before running tests, ensure you have:

```bash
# Required environment variables
VIETMAP_API_KEY=your_vietmap_api_key_here
```

## ▶️ Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test src/tests/place-v4-api.test.ts

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🎯 Test Philosophy

### Edge Case Focus

These tests prioritize edge cases and error conditions over happy path testing, because:

- Happy path is usually covered by basic integration tests
- Edge cases reveal the most bugs and security vulnerabilities
- Real-world usage often involves unexpected inputs
- Robust error handling is crucial for production APIs

### Security-First Approach

All input validation tests include security attack vectors:

- **SQL Injection**: Prevent database attacks
- **XSS**: Prevent script injection
- **Path Traversal**: Prevent file system access
- **Command Injection**: Prevent system command execution

### Real-world Simulation

Tests simulate actual usage patterns:

- Data flows between different API endpoints
- Encoding/decoding scenarios
- Network failure conditions
- Rate limiting and throttling

## 📊 Test Coverage Goals

- **Input Validation**: 100% parameter combinations
- **Error Handling**: All error code paths
- **Security Vectors**: Common attack patterns
- **Edge Cases**: Boundary conditions
- **Integration**: Cross-API workflows

## 🔍 Test Helpers

The `test-helpers.ts` file provides:

### Constants

- `TEST_CONFIG`: Timeouts, retry counts, common test data
- `VALIDATION_PATTERNS`: Common validation patterns

### Helper Functions

- `TestHelpers.delay()`: Async delay for timing tests
- `TestHelpers.isValidRefIdFormat()`: RefId format validation
- `TestHelpers.isValidVietnamCoordinates()`: Coordinate validation
- `TestHelpers.generateMaliciousStrings()`: Security test vectors

### Environment Validation

- `validateTestEnvironment()`: Ensures required env vars are present

## 📝 Writing New Tests

When adding new test files:

1. **Import test helpers**:

   ```typescript
   import {
     TEST_CONFIG,
     TestHelpers,
     validateTestEnvironment,
   } from './test-helpers';
   ```

2. **Follow the naming convention**:

   ```
   {api-name}-{version}-api.test.ts
   ```

3. **Use the standard test structure**:
   - Group tests by category (describe blocks)
   - Use descriptive test names
   - Include timeout configuration
   - Add security test cases
   - Validate all response fields

4. **Include edge cases**:
   - Empty/null inputs
   - Invalid formats
   - Security attack vectors
   - Network failure scenarios
   - Rate limiting tests

## 🚨 Important Notes

### Rate Limiting

- Tests include delays to prevent rate limiting
- Concurrent request tests are carefully designed
- Use `TestHelpers.delay()` when needed

### Security Testing

- Malicious inputs are contained in test environment
- No actual harm is intended or caused
- Tests verify proper input sanitization

### Environment Variables

- Never commit real API keys
- Use `.env.example` for documentation
- Tests will fail gracefully if env vars are missing

## 🔄 Continuous Integration

These tests are designed to run in CI/CD environments:

- Environment variable validation
- Timeout handling
- Graceful failure modes
- Comprehensive error reporting

## 📈 Metrics and Reporting

Track test metrics:

- **Test Coverage**: Aim for >95% edge case coverage
- **Performance**: Monitor API response times
- **Reliability**: Track test stability over time
- **Security**: Ensure all attack vectors are blocked
