Feature: Step Definitions
  As a developer using co-gherkin
  I want to define steps with different patterns
  So that I can write flexible and maintainable tests

  Scenario: Register a simple Given step
    Given I initialize the step registry
    When I define a Given step with pattern "I am logged in"
    Then the step should be registered successfully
    And the registry should contain 1 step

  Scenario: Register steps with string parameters
    Given I initialize the step registry
    When I define a step with pattern "I enter {string} and {string}"
    Then the step should match "I enter \"user@test.com\" and \"password123\""
    And it should extract 2 parameters

  Scenario: Register steps with regex patterns
    Given I initialize the step registry
    When I define a step with regex pattern "^I have ([0-9]+) items$"
    Then the step should match "I have 5 items"
    And it should extract "5" as parameter

  Scenario: Use all Gherkin keywords
    Given I initialize the step registry
    When I define steps for all keywords
    Then Given keyword should work
    And When keyword should work
    And Then keyword should work
    And And keyword should work
    And But keyword should work
    * Star keyword should work

  Scenario: Reuse step definitions across keywords
    Given I initialize the step registry
    When I define a step "the user is authenticated"
    Then I can use it with Given "the user is authenticated"
    And I can use it with When "the user is authenticated"
    And I can use it with Then "the user is authenticated"
    And I can use it with And "the user is authenticated"

  Scenario: Handle undefined steps
    Given I initialize the step registry
    When I try to execute an undefined step
    Then it should throw an error with message "Step not found"
