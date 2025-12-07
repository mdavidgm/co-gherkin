Feature: Gherkin Parser
  As a developer using co-gherkin
  I want to parse Gherkin feature files
  So that I can execute BDD scenarios

  Scenario: Parse a simple feature
    Given I have a feature file with content:
      """
      Feature: Login
        Scenario: Successful login
          Given I am on login page
          When I enter credentials
          Then I see dashboard
      """
    When I parse the feature file
    Then it should contain 1 feature
    And the feature name should be "Login"
    And it should contain 1 scenario
    And the scenario should have 3 steps

  Scenario: Parse Background
    Given I have a feature file with Background:
      """
      Feature: Shopping
      Background:
        Given I am logged in
        And I have an empty cart
      Scenario: Add item
        When I add "Apples" to the cart
        Then the cart should contain "Apples"
      """
    When I parse the feature file
    Then the Background should have 2 steps
    And the Scenario should have 2 steps

  Scenario: Parse Scenario Outline
    Given I have a feature file with Scenario Outline:
      """
      Feature: Calculator
        Scenario Outline: Add numbers
          Given I have entered <a>
          And I have entered <b>
          When I press add
          Then the result is <result>

    Examples:
      | a | b | result |
      | 1 | 2 | 3      |
      | 5 | 7 | 12     |
      """
    When I parse the feature file
    Then it should generate 2 scenarios from examples
    And each scenario should have parameters replaced

  Scenario: Parse Data Tables
    Given I have a feature file with data table:
      """
      Feature: Users
        Scenario: Create users
          Given the following users:
            | name  | email          |
            | Alice | alice@test.com |
            | Bob   | bob@test.com   |
      """
    When I parse the feature file
    Then the step should have a data table with 3 rows
    And the data table should have 2 columns

  Scenario: Parse multi-line strings
    Given I have a feature file with docstring:
      """
      Feature: API
        Scenario: Send request
          Given I have a request body:
            \"\"\"
            {
            "name": "test",
            "value": 123
            }
            \"\"\"
      """
    When I parse the feature file
    Then the step should have a docstring parameter
