// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { DisplayableStrings } from 'common/constants/displayable-strings';
import * as styles from './no-displayable-preview-features-message.scss';

export const componentId = 'no-displayable-feature-flag-message';
export const NoDisplayableFeatureFlagMessage = NamedFC('NoDisplayableFeatureFlagMessage', () => (
    <>
        <div id={componentId} className={styles.noPreviewFeatureMessage}>
            {DisplayableStrings.noPreviewFeatureDisplayMessage}
        </div>
    </>
));
