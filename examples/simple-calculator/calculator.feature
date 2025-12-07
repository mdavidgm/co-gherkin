Feature: Simple Calculator
  As a user
  I want to perform basic arithmetic operations
  So that I can verify my calculations

  Scenario: Addition
    Given I start with 0
    When I add 5
    And I add 3
    Then the result should be 8

  Scenario Outline: Mixed operations
    Given I start with <initial>
    When I add <added>
    Then the result should be <result>

    Examples:
      | initial | added | result |
      | 10      | 5     | 15     |
      | 0       | 0     | 0      |
      | -5      | 10    | 5      |
