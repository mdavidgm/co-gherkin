Feature: Coverage Scenarios

  Background:
      Given I am setting up coverage

  Scenario Outline: Outline followed by Scenario
      When I use <value>
  
  Examples:
      | value |
      | 1     |

  Scenario: Trailing scenario
      Then I am done

  Scenario: Data Table Usage
      Given I have a table:
          | col1 | col2 |
          | a    | b    |

  Scenario: 
      Given I am setting up coverage
