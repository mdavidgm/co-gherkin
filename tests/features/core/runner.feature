Feature: Feature Runner
  As a developer using co-gherkin
  I want to run feature files
  So that I can execute my BDD tests

  Scenario: Run a simple feature
    Given I have a feature file "simple.feature"
    And I have defined all required steps
    When I run the feature
    Then all scenarios should pass
    And all steps should execute in order

  Scenario: Run feature with Background
    Given I have a feature with Background
    And the Background has setup steps
    When I run the feature
    Then the Background should run before each scenario
    And each scenario should have clean state

  Scenario: Run Scenario Outline with Examples
    Given I have a Scenario Outline with 3 examples
    When I run the feature
    Then it should execute 3 scenarios
    And each scenario should use different parameters

  Scenario: Handle step failures
    Given I have a feature with a failing step
    When I run the feature
    Then the scenario should fail
    And subsequent steps should not execute
    And the error should be reported

  Scenario: Execute hooks
    Given I have BeforeScenario and AfterScenario hooks
    When I run a feature with 2 scenarios
    Then BeforeScenario should run 2 times
    And AfterScenario should run 2 times
    And hooks should run in correct order
