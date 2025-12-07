Feature: Hooks
  As a developer using co-gherkin
  I want to use lifecycle hooks
  So that I can setup and cleanup test state

  Scenario: Register BeforeScenario hook
    Given I have a hook registry
    When I register a BeforeScenario hook
    Then the hook should be registered
    And it should execute before each scenario

  Scenario: Register AfterScenario hook
    Given I have a hook registry
    When I register an AfterScenario hook
    Then the hook should be registered
    And it should execute after each scenario

  Scenario: Multiple hooks execution order
    Given I have registered 3 BeforeScenario hooks
    When a scenario runs
    Then all 3 hooks should execute
    And they should execute in registration order

  Scenario: Hooks with async operations
    Given I have an async BeforeScenario hook
    When a scenario runs
    Then the hook should complete before scenario steps
    And async operations should finish

  Scenario: Hook error handling
    Given I have a BeforeScenario hook that throws an error
    When a scenario runs
    Then the hook error should be caught
    And the scenario should fail
    And the error should be reported
