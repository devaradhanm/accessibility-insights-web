// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardSelectionViewData } from 'common/get-card-selection-view-data';
import { getCardViewData } from 'common/rule-based-view-model-provider';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import {
    InstanceResultStatus,
    UnifiedResult,
    UnifiedRule,
} from 'common/types/store-data/unified-data-interface';

type TestScenario = {
    isExpanded: boolean;
    isSelected: boolean;
    isHighlighted: boolean;
    visualHelperEnabled: boolean;
};

describe('RuleBasedViewModelProvider', () => {
    const emptyCardSelectionViewData = {} as CardSelectionViewData;

    test('getUnifiedRuleResults with null rules and results', () => {
        const actualResults: CardsViewModel = getCardViewData(null, null, null);

        expect(actualResults).toEqual(null);
    });

    test('getUnifiedRuleResults with null rules', () => {
        const actualResults: CardsViewModel = getCardViewData(null, [], emptyCardSelectionViewData);

        expect(actualResults).toEqual(null);
    });

    test('getUnifiedRuleResults with null results', () => {
        const actualResults: CardsViewModel = getCardViewData([], null, emptyCardSelectionViewData);

        expect(actualResults).toEqual(null);
    });

    test('getUnifiedRuleResults with null card selection view data', () => {
        const actualResults: CardsViewModel = getCardViewData([], [], null);

        expect(actualResults).toEqual(null);
    });

    const testScenarios = createTestScenarios();

    it.each(testScenarios)('getUnifiedRuleResults for combination %p', testScenario => {
        const rules = getSampleRules();

        const resultStub1 = createUnifiedResultStub('pass', 'rule1');
        const resultStub2 = createUnifiedResultStub('fail', 'rule1');
        const resultStub3 = createUnifiedResultStub('unknown', 'rule2');
        const resultStub4 = createUnifiedResultStub('unknown', 'rule2');

        const results: UnifiedResult[] = [resultStub1, resultStub2, resultStub3, resultStub4];

        const cardSelectionViewData: CardSelectionViewData = {
            expandedRuleIds: testScenario.isExpanded ? ['rule1'] : [],
            highlightedResultUids: testScenario.isHighlighted ? ['stub_uid'] : [],
            selectedResultUids: testScenario.isSelected ? ['stub_uid'] : [],
            visualHelperEnabled: testScenario.visualHelperEnabled,
        };

        const actualResults: CardsViewModel = getCardViewData(
            rules,
            results,
            cardSelectionViewData,
        );

        expect(actualResults).toMatchSnapshot();
    });

    function getSampleRules(): UnifiedRule[] {
        const rules: UnifiedRule[] = [];

        for (let i = 1; i <= 3; i++) {
            rules.push(createUnifiedRuleStub(`rule${i}`));
        }

        return rules;
    }

    function createUnifiedRuleStub(id: string): UnifiedRule {
        return {
            id: id,
            description: `stub_description_${id}`,
            url: `stub_url_${id}`,
            guidance: [
                {
                    href: `stub_guidance_href_${id}`,
                    text: `stub_guidance_text_${id}`,
                },
            ],
        };
    }

    function createUnifiedResultStub(status: InstanceResultStatus, id: string): UnifiedResult {
        return {
            uid: 'stub_uid',
            status: status,
            ruleId: id,
            identifiers: null,
            descriptors: null,
            resolution: null,
        };
    }

    function createTestScenarios(): TestScenario[] {
        const scenarios: TestScenario[] = [];

        // tslint:disable-next-line: no-bitwise
        const matchesBit = (i: number, bit: number) => (i & Math.pow(2, bit)) !== 0;

        for (let i = 0; i < 16; ++i) {
            const scenario: TestScenario = {
                isExpanded: matchesBit(i, 0),
                isHighlighted: matchesBit(i, 1),
                isSelected: matchesBit(i, 2),
                visualHelperEnabled: matchesBit(i, 3),
            };

            scenarios.push(scenario);
        }

        return scenarios;
    }
});
